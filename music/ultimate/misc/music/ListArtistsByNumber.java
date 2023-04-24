package ultimate.misc.music;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListArtistsByNumber
{
	public static void main(String[] args)
	{
		File file = new File("M:/music");
		Map<String, Tag> tags = new HashMap<>();

		scanFiles(file, tags);

		List<Tag> tagList = new ArrayList<>(tags.values());
		Collections.sort(tagList);

		for(Tag t : tagList)
		{
			System.out.println(t.count + "\t" + t.tag);
		}
	}

	public static void scanFiles(File file, Map<String, Tag> tags)
	{
		if(file.isDirectory())
		{
			for(File f : file.listFiles())
			{
				scanFiles(f, tags);
			}
		}
		else
		{
			handleFile(file, tags);
		}
	}

	public static void handleFile(File file, Map<String, Tag> tags)
	{
		if(file.isDirectory())
			return;
		if(!file.getName().endsWith(".mp3") && !file.getName().endsWith(".wma"))
			return;
		if(!file.getName().contains("-"))
			return;
		
		String name = file.getName();
		String[] split = name.substring(0, name.indexOf("-")).split("(feat.|,|&)");
		for(int i = 0; i < split.length; i++)
		{
			split[i] = split[i].trim();
			if(tags.containsKey(split[i]))
			{
				tags.get(split[i]).count++;
			}
			else
			{
				tags.put(split[i], new Tag(split[i]));
			}
		}
	}

	private static class Tag implements Comparable<Tag>
	{
		String	tag;
		int		count;

		public Tag(String tag)
		{
			this.tag = tag;
			this.count = 1;
		}

		@Override
		public int compareTo(Tag o)
		{
			if(o.count != this.count)
				return o.count - this.count;
			else
				return this.tag.compareTo(o.tag);
		}
	}
}
