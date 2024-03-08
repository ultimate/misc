package ultimate.misc.files;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

public class DuplicateFinder
{
	private static final boolean DELETE_FILES = true;
	private static final boolean DELETE_PRIMARY = false;
	private static final boolean DELETE_SECONDARY = true;
	private static final boolean CONSIDER_SIZE = false;

	public static void main(String[] args) throws InterruptedException
	{
		File folder1 = new File(args[0]);
		File folder2 = new File(args[1]);

		FilenameFilter filter = new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name)
			{
				if(dir.getName().contains("-Dateien"))
					return false;
				if(name.equalsIgnoreCase("thumbs.db"))
					return false;
				return true;
			}
		};

		DuplicateFinder df = new DuplicateFinder(filter, folder1, folder2);

		df.start();
		df.join();

		df.listDuplicates();

		List<File> deleteCandidates = df.createDeleteList(folder1);

		int deletedPrimary = 0;
		long deletedPrimarySize = 0;
		int deletedOther = 0;
		long deletedOtherSize = 0;

		for(File f : deleteCandidates)
		{
			if(f.getAbsolutePath().startsWith(folder1.getAbsolutePath()))
			{
				if(!DELETE_PRIMARY)
					continue;
				deletedPrimary++;
				deletedPrimarySize += f.length();
			}
			else
			{
				if(!DELETE_SECONDARY)
					continue;
				deletedOther++;
				deletedOtherSize += f.length();
			}
			if(!deleteFile(f))
				System.out.println("WARN: could not be deleted!");
		}

		System.out.println("-------------------------------------------");
		System.out.println("deleted primary   = " + deletedPrimary + "\t size = " + size(deletedPrimarySize));
		System.out.println("deleted other     = " + deletedOther + "\t size = " + size(deletedOtherSize));

		System.out.println("deleted total     = " + (deletedPrimary + deletedOther) + "\t size = " + size(deletedPrimarySize + deletedOtherSize));
		System.out.println("-------------------------------------------");

	}

	private HashMap<String, Set<File>>	fileMapping	= new HashMap<>();
	private FilenameFilter				filter;
	private File[]						folders;

	private List<Worker>				workers;

	public DuplicateFinder(FilenameFilter filter, File... folders)
	{
		this.folders = folders;
		this.filter = filter;

		workers = new ArrayList<>(folders.length);
		for(File folder : this.folders)
			workers.add(new Worker(folder, this.filter));
	}

	public void start()
	{
		for(Worker w : workers)
			w.start();
	}

	public void join() throws InterruptedException
	{
		for(Worker w : workers)
			w.join();
	}

	public HashMap<String, Set<File>> getFileMapping()
	{
		return fileMapping;
	}

	public void listDuplicates()
	{
		int uniqueFiles = 0;
		long uniqueFileSize = 0;
		int totalFiles = 0;
		long totalFileSize = 0;

		int count;
		for(Entry<String, Set<File>> e : fileMapping.entrySet())
		{
			count = e.getValue().size();
			if(count > 1)
			{
				uniqueFiles++;

				System.out.print(e.getKey());
				System.out.print("\t\t\t");
				System.out.println("count=" + count);
				int i = 0;
				for(File f : e.getValue())
				{
					if(i == 0)
						uniqueFileSize += f.length();

					i++;
					totalFiles++;
					totalFileSize += f.length();
					System.out.println("\t\t" + f.getAbsolutePath());
				}
			}
		}
		System.out.println("-------------------------------------------");
		System.out.println("unique files   = " + uniqueFiles + "\t size = " + size(uniqueFileSize));
		System.out.println("total files    = " + totalFiles + "\t size = " + size(totalFileSize));

		System.out.println("to be deleted  = " + (totalFiles - uniqueFiles) + "\t size = " + size(totalFileSize - uniqueFileSize));
		System.out.println("-------------------------------------------");
	}

	public List<File> createDeleteList(File primaryFolder)
	{
		List<File> deleteCandidates = new LinkedList<>();
		int count;
		for(Entry<String, Set<File>> e : fileMapping.entrySet())
		{
			count = e.getValue().size();
			if(count > 1)
			{
				Set<File> tmp = e.getValue();
				File primary = null;
				for(File f : e.getValue())
				{
					if(primary == null || f.getAbsolutePath().startsWith(primaryFolder.getAbsolutePath()))
						primary = f;
				}
				tmp.remove(primary);
				deleteCandidates.addAll(tmp);
			}
		}
		return deleteCandidates;
	}

	private class Worker extends Thread
	{
		private File			folder;
		private FilenameFilter	filter;

		public Worker(File folder, FilenameFilter filter)
		{
			this.folder = folder;
			this.filter = filter;
		}

		public void run()
		{
			process(this.folder);
		}

		private void process(File file)
		{
			if(file.isDirectory())
			{
				for(File f : file.listFiles(this.filter))
					process(f);
			}
			else
			{
				String key = file.getName() + (CONSIDER_SIZE ? ":" + file.length() : "");
				synchronized(fileMapping)
				{
					if(!fileMapping.containsKey(key))
						fileMapping.put(key, new HashSet<>());
					fileMapping.get(key).add(file);
				}
			}
		}
	}

	private static String size(long bytes)
	{
		float s = bytes;
		String unit = "B";
		if(s > 1024)
		{
			s /= 1024.0f;
			unit = "KB";
		}
		if(s > 1024)
		{
			s /= 1024.0f;
			unit = "MB";
		}
		if(s > 1024)
		{
			s /= 1024.0f;
			unit = "GB";
		}
		return (Math.round(s * 100) / 100.0) + unit;
	}

	public static boolean deleteFile(File file)
	{
		System.out.println("deleting " + (file.isDirectory() ? "directory" : "file") + ": " + file.getAbsolutePath());
		boolean success = true;
		if(DELETE_FILES)
		{
			File parent = file.getParentFile();
			success = success && file.delete();
			if(parent.list().length == 0)
				success = success && parent.delete();
		}
		return success;
	}
}
