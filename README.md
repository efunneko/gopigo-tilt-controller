# gopigo-tilt-controller
Tablet/phone browser controller for the gopigo robot

This repository provides a simple controller for the gopigo that can be run from any phone or tablet. Note that the device must be used in __landscape__ orientation.

# Installation

Make sure you gopigo is powered up and is configured with network access as described by the gopigo getting started guide. It is a good idea to turn the gopigo upside down until you have finished installation and testing. You don't want to drive it off a table or down the stairs. 

Login into the Raspberry Pi via ssh or through the web interface. Then in a terminal window, install the python tornado package:

    sudo pip install tornado
    
Then clone this repository:

    git clone git@github.com:efunneko/gopigo-tilt-controller.git
    
Finally, enter the directory and start the server:

    cd gopigo-tilt-controller
    ./gopigo-tilt-controller.py
    
If you don't know your gopigo IP address, you can get it with:

    ip address show
    
It will be four numbers separated by periods, for example: 192.168.1.15

Now grab a tablet or phone, launch a browser and go to http://\<your-pi-IP\>:8888

If all is working you will get a screen with a couple of speed gauges and a speed slider. You can touch the speed slider and you should be able to make the wheels go forward or backwards by sliding your finger up and down. Now if you tilt the phone/table side to side it will vary the speed of the wheels in order to make it turn.

NOTE that you need to hold the phone or tablet in landscape orientation so that the tilting works. 
NOTE you must only have a single phone/tablet connected to the gopigo at a time or you will confuse it.

# Auto start after turning on gopigo

If you want to have this server automatically start after powering on the gopigo, you need to login into the gopigo and run the following:

    sudo echo 'cd /home/pi/gopigo-tilt-controller.py && ./gopigo-tilt-controller.py' >> /etc/rc.local
    
You should test this with a reboot:

    sudo reboot
    
Then wait at least 30 seconds and try to connect to the gopigo from a browser. 

# Future Items

Things that should be fixed:

* Behave better when multiple browsers are connected 
* Detect an orientation change of the browser
* Handle the tilt properly when in portrait mode
