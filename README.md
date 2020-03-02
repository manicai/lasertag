Laser Tag Bot

[![Build Status](https://travis-ci.com/manicai/lasertag.svg?branch=master)](https://travis-ci.com/manicai/lasertag)

Code for the Technic and Raspberry Pi laser tag pair of robots I am building. Details of the robots will be in some
blog posts in due course. The code here will need modification unless you build an identically connected robot. However
modification should be fairly easy.

The web portion provides a joypad and fire button as a full screen web page. It has been designed for use with a
recent iPhone without any testing on other platforms (although I don't believe I've used any iOS specific features). 
However it is completely independent of the robot hardware. It communicates with the server, which is designed to run 
on the robot, via WebSockets. The HTTP portion of the server talks to a instantiation of the `Robot` object from the
`robot_interface.py` file, so updates for different hardware should just be a matter of changing the method 
implementations in that file. Currently it assumes you are using a Pimoroni Explorer pHat to interface with the 
hardware. 

 