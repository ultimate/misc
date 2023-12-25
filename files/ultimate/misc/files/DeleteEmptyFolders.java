package ultimate.misc.files;

import java.io.File;

public class DeleteEmptyFolders
{
	private static final boolean DELETE_FILES = true;

	public static void main(String[] args) throws InterruptedException
	{
		File folder = new File(args[0]);
		
		delete(folder);
	}

	public static boolean delete(File file)
	{
		
		if(!file.isDirectory())
			return false;
		
		for(File f: file.listFiles())
		{
			delete(f);
		}
		
		if(file.listFiles().length == 0)
		{
			System.out.println("deleting " + (file.isDirectory() ? "directory" : "file") + ": " + file.getAbsolutePath());
			if(DELETE_FILES)
				return file.delete();
		}
		return false;
	}
}
