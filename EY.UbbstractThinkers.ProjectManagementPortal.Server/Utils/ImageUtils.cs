using EY.UbbstractThinkers.ProjectManagementPortal.Server.Exceptions;
using System;

namespace EY.UbbstractThinkers.ProjectManagementPortal.Server.Utils
{
    public static class ImageUtils
    {
        public const string PNG = "image/png";
        public const string JPG = "image/jpg";
        public const string JPEG = "image/jpeg";
        public const string GIF = "image/gif";
        public const string Unknown = "unknown";

        public static string GetImageFormat(byte[] imageData)
        {
            if (imageData.Length < 4)
            {
                return Unknown;
            }

            if (imageData[0] == 0xFF && imageData[1] == 0xD8)
            {
                return JPEG;
            }

            if (imageData[0] == 0x89 && imageData[1] == 0x50 &&
                imageData[2] == 0x4E && imageData[3] == 0x47)
            {
                return PNG;
            }

            if (imageData[0] == 'G' && imageData[1] == 'I' && imageData[2] == 'F' && imageData[3] == '8' && (imageData[4] == '9' || imageData[4] == '7') && imageData[5] == 'a')
            {
                return GIF;
            }

            return Unknown;
        }

        public static byte[] ConvertBase64ToBlob(string base64String)
        {
            if (string.IsNullOrWhiteSpace(base64String))
            {
                throw new ApiException("Base64 string cannot be null or empty.");
            }

            if (!base64String.StartsWith("data:image/"))
            {
                throw new ApiException("Invalid Base64 string format. Expected data URL format.");
            }

            var commaIndex = base64String.IndexOf(',');
            var mimeType = base64String.Substring(5, commaIndex - 12);

            var base64Data = base64String.Substring(base64String.IndexOf(",") + 1);
            var imageData = Convert.FromBase64String(base64Data);

            string actualMimeType = GetImageFormat(imageData);

            if (actualMimeType != mimeType && !(mimeType == JPG && actualMimeType == JPEG))
            {
                throw new ApiException($"MIME type mismatch: expected {mimeType}, but got {actualMimeType}.");
            }

            return imageData;
        }

        public static string ConvertBlobToBase64(byte[] blob)
        {
            if (blob == null)
            {
                throw new ApiException("Blob cannot be null.");
            }

            string base64String = Convert.ToBase64String(blob);
            var mimeType = GetImageFormat(blob);

            if (mimeType == Unknown)
            {
                throw new ApiException("MIME type unknown");
            }

            return $"data:{mimeType};base64,{base64String}";
        }
    }
}
