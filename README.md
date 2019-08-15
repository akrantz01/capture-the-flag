# Capture The Flag
###### By [Alex Krantz](https://github.com/akrantz01) and [Kai Fronsdal](https://github.com/kaifronsdal)

## Description
A continuous multiplayer capture the flag game built with [BabylonJS](https://github.com/BabylonJS/Babylon.js) and [Golang](https://golang.org). BabylonJS is the rendering engine and physics stimulator we are using. The multiplayer server is written in Golang and loosely based off of another project called [MMOS](https://github.com/akrantz01/mmos).

## Running It
* Download a server binary from the [releases](https://github.com/akrantz01/capture-the-flag/releases) tab
  * The naming scheme is: `capture-the-flag.[OS].[arch]`
  * For Windows 64-bit, this would be: `capture-the-flag.win.amd64.exe`
* Also download the game files called `game.zip`
* Create a new folder and move `game.zip` and the server binary into it
* Unzip `game.zip` in that directory
* Find the folder named `public` and make sure it is at the same level as the server binary
* Create the configuration file
* Run the server binary
* Navigate to your server's IP address

## Server Configuration
The server is configured with a file that can be in either JSON or YAML, which ever you prefer. To see an example of the configuration file, see [config.sample.yaml](/config.yaml).

## Disclaimer
Please keep in mind that we are both juniors in high school which means that we won't be able to provide much support and game updates will come fairly infrequently.
