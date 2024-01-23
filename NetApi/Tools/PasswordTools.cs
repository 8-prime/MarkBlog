using System.Security.Cryptography;
using System.Text;
using Isopoh.Cryptography.Argon2;
using Isopoh.Cryptography.SecureArray;

namespace NetApi.Tools;

public static class PasswordTools
{
    private static readonly int saltLength = 16;
    private static readonly RandomNumberGenerator Rng = RandomNumberGenerator.Create();
    public static string HashWithSalt(string password)
    {
        byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
        byte[] salt = new byte[saltLength];
        Rng.GetBytes(salt);

    
        var config = new Argon2Config
        {
            Type = Argon2Type.DataIndependentAddressing,
            Version = Argon2Version.Nineteen,
            TimeCost = 10,
            MemoryCost = 32768,
            Lanes = 5,
            Threads = Environment.ProcessorCount, // higher than "Lanes" doesn't help (or hurt)
            Password = passwordBytes,
            Salt = salt, // >= 8 bytes if not null
            HashLength = 20 // >= 4
        };
        var argon2A = new Argon2(config);
        string hashString;
        using(SecureArray<byte> hashA = argon2A.Hash())
        {
            hashString = config.EncodeString(hashA.Buffer);
        }

        return hashString;
    }

    public static bool Verify(string password, string hashed){
        bool isValid = false;

        var configOfPasswordToVerify = new Argon2Config { Password = Encoding.UTF8.GetBytes(password), Threads = Environment.ProcessorCount };
        SecureArray<byte>? hashB = null;
        try
        {
            if (configOfPasswordToVerify.DecodeString(hashed, out hashB) && hashB != null)
            {
                var argon2ToVerify = new Argon2(configOfPasswordToVerify);
                using(var hashToVerify = argon2ToVerify.Hash())
                {
                    if (Argon2.FixedTimeEquals(hashB, hashToVerify))
                    {
                        isValid = true;
                    }
                }
            }
        }
        finally
        {
            hashB?.Dispose();
        }
        return isValid;
    }
}