package ultimate.misc.files;

import java.io.File;
import java.io.IOException;
import java.util.List;

import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.FileHeader;

public class ZipCracker
{
	public static char[]	PW_CHARS		= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ~`!@#$%^&*()-_=+[{]}\\|;:'\"/?.>,<".toCharArray();
	public static int		MIN_PW_LENGTH	= 5;
	public static int		MAX_PW_LENGTH	= 12;
	public static int		OUTPUT_INTERVAL	= 1000;

	public static void main(String[] args)
	{
		String pw = crack(new File(args[0]), new File(args[1]));
		System.out.println("password = '" + pw + "'");
	}

	public static String crack(File file, File destination)
	{
		char[] pwArray = new char[MAX_PW_LENGTH];
		int[] chars = new int[pwArray.length];
		int pwIndex = MIN_PW_LENGTH-1;
		String pw;
		boolean success = false;
		int passwordsTried = 0;;
		
		long start = System.currentTimeMillis();
		long timepassed;
		long nextOutput = OUTPUT_INTERVAL;
		
		while(pwIndex < pwArray.length)
		{
			for(int i = 0; i <= pwIndex; i++)
				pwArray[i] = PW_CHARS[chars[i]];
			pw = new String(pwArray, 0, pwIndex + 1);
			success = unzip(file, pw, destination);
			passwordsTried++;
			//System.out.println("unzipping: " + file.getAbsolutePath() + " --> " + destination.getAbsolutePath() + " | pw = '" + pw + "' --> " + success);
			
			if(success)
				return new String(pw);

			pwIndex = increaseIndex(chars, pwIndex);
			
			timepassed = System.currentTimeMillis() - start;
			if(timepassed > nextOutput)
			{
				System.out.println("t = " + timepassed/1000 + " \tpasswords tried = " + passwordsTried + " \tlast pw = '" + pw + "'");
				nextOutput += OUTPUT_INTERVAL;
			}
		}
		return null;
	}

	public static int increaseIndex(int[] chars, int pwIndex)
	{
		chars[pwIndex]++;
		if(chars[pwIndex] >= PW_CHARS.length)
		{
			chars[pwIndex] = 0;

			if(pwIndex == 0)
				return pwIndex + 1;

			int i = increaseIndex(chars, pwIndex - 1);
			if(i == pwIndex - 1)
				return pwIndex;
			else
				return pwIndex + 1;
		}
		return pwIndex;
	}

	public static boolean unzip(File file, String password, File destination)
	{
		ZipFile zipFile = new ZipFile(file);
		try
		{
			if(zipFile.isEncrypted())
				zipFile.setPassword(password.toCharArray());
			List<FileHeader> fileHeaderList = zipFile.getFileHeaders();

			for(FileHeader fileHeader : fileHeaderList)
			{
				// Path where you want to Extract
				zipFile.extractFile(fileHeader, destination.getAbsolutePath());
				System.out.println("Extracted");
			}
			return true;
		}
		catch(Exception e)
		{
			// e.printStackTrace();
			return false;
		}
		finally
		{
			try
			{
				zipFile.close();
			}
			catch(IOException e)
			{
				// e.printStackTrace();
			}
		}
	}
}