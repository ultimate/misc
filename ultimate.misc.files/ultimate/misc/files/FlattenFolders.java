package ultimate.misc.files;
import java.io.File;

public class FlattenFolders
{
	public static void main(String[] args)
	{
		File folder = new File("D:\\video\\recordings-tmp");
		flatten(folder.listFiles(), folder);
	}
	
	public static void flatten(File[] files, File newFolder)
	{
		String newName;
		for(File f: files)
		{
			if(f.isFile())
			{
				newName = newFolder.getAbsolutePath() + "\\" + f.getName();
				System.out.print(f.getAbsolutePath() + " --> " + newName);
				f.renameTo(new File(newName));			
				System.out.println(" .. OK");
			}
			if(f.isDirectory())
				flatten(f.listFiles(), newFolder);
		}
	}
}
