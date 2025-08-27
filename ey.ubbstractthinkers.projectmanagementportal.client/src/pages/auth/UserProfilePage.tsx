import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import BoxContent from "../../components/layout/background/BoxContent";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { getUser, updateUser } from "@services/AuthClient";
import useSnackbar from "../../hooks/useSnackbar";
import CustomSnackbar from "../../components/snackbar/CustomSnackbar";
import { handleApiError } from "@services/ErrorHandler";
import { type User } from "@models/Auth";
import styles from "./UserProfilePage.module.css";
import UserAvatar from "../../components/avatar/UserAvatar";
import { useAuth } from "../../components/context/auth/AuthFunction";
import ClearIcon from "@mui/icons-material/Clear";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

interface UserProfilePageProps {
  open: boolean;
}

const UserProfilePage = (props: UserProfilePageProps) => {
  const { loggedUser, handleSetLoggedUser } = useAuth();

  const [firstName, setFirstName] = useState<string | null>("");
  const [lastName, setLastName] = useState<string | null>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    showSnackbar,
    isSnackbarOpen,
    message,
    snackbarSeverity,
    handleSnackbarClose,
  } = useSnackbar();

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const user = await getUser();

        handleSetLoggedUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setProfileImage(user.profileImage);
      } catch (error) {
        showSnackbar(handleApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const isFormChanged =
    firstName !== loggedUser.firstName ||
    lastName !== loggedUser.lastName ||
    profileImage !== loggedUser.profileImage;

  const isProfilePictureSet = profileImage !== null;

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formattedUser: User = {
      ...loggedUser,
      firstName,
      lastName,
      profileImage,
    };

    setIsUpdating(true);

    try {
      await updateUser(formattedUser);

      showSnackbar("User updated successfully", "success");

      handleSetLoggedUser(formattedUser);
    } catch (error) {
      showSnackbar(handleApiError(error), "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <BoxContent
      isOpen={props.open}
      pageName={`${loggedUser.firstName} ${loggedUser.lastName}'s Profile`}
    >
      {isLoading ? (
        <Box className={styles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} className={styles.form}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <UserAvatar
                user={
                  {
                    ...loggedUser,
                    profileImage,
                  } as User
                }
                onClick={handleAvatarClick}
                className={styles.userAvatar}
                imageClassName={styles.image}
              />

              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                onChange={handleFileChange}
                ref={fileInputRef}
                hidden
              />
            </Grid>

            <Grid container size={{ xs: 12, sm: 6 }} spacing={2}>
              <Grid size={{ xs: 12 }} className={styles.attribute}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={handleChangeFirstName}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }} className={styles.attribute}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={handleChangeLastName}
                  required
                />
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                variant="outlined"
                className={styles.button}
                startIcon={<ClearIcon className={styles.icon} />}
                onClick={handleClearPhoto}
                disabled={!isProfilePictureSet}
              >
                Clear Photo
              </Button>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                type="submit"
                variant="outlined"
                className={styles.button}
                startIcon={<UpdateOutlinedIcon className={styles.icon} />}
                disabled={!isFormChanged || isUpdating}
              >
                {isUpdating ? <CircularProgress /> : "Update"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <CustomSnackbar
        isOpen={isSnackbarOpen}
        message={message}
        snackbarSeverity={snackbarSeverity}
        handleSnackbarClose={handleSnackbarClose}
      />
    </BoxContent>
  );
};

export default UserProfilePage;
