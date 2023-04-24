package ultimate.misc.mousemove;
import java.awt.Robot;
import java.awt.AWTException;
import java.awt.HeadlessException;
import java.awt.MouseInfo;
import java.awt.Point;

/**
 * This is a very simple stand-alone java program, that moves the mouse frequently in order to protect the PC from going to sleep or screensaver. This
 * also will keep you "green" / available in messengers :) <br>
 * <br>
 * Provided without warranty...
 * 
 * @author ultimate
 */
public class MouseMove
{
	public static final int	FACTOR		= 1000;	// all following numbers in seconds
	public static final int	INTERVAL	= 1;
	public static final int	TIMEOUT		= 5;
	public static final int	DELTA		= 10;

	public static void main(String[] args) throws InterruptedException
	{
		Thread t = new Thread() {
			public void run()
			{
				Robot r = null;
				Point lastP, newP;
				int unchangedCount = 0;

				lastP = MouseInfo.getPointerInfo().getLocation();

				while(true)
				{
					try
					{
						newP = MouseInfo.getPointerInfo().getLocation();
						if(newP.equals(lastP))
						{
							if(unchangedCount == 0)
							{
								System.out.print("no motion detected");
								r = new Robot(MouseInfo.getPointerInfo().getDevice());
							}
							else if(unchangedCount % TIMEOUT == 0)
							{
								System.out.print(":");
								r.mouseMove((int) lastP.getX() + DELTA, (int) lastP.getY());
								r.mouseMove((int) lastP.getX(), (int) lastP.getY());
							}
							else
							{
								System.out.print(".");
							}
							unchangedCount++;
						}
						else
						{
							if(unchangedCount > 0)
								System.out.println("moved");
							unchangedCount = 0;
							lastP = newP;
							r = null;
						}
						Thread.sleep(INTERVAL * FACTOR);
					}
					catch(InterruptedException e)
					{
						e.printStackTrace();
					}
					catch(HeadlessException e)
					{
						e.printStackTrace();
					}
					catch(AWTException e)
					{
						e.printStackTrace();
					}
				}
			}
		};
		t.start();
		t.join();
		System.exit(0);
	}
}
