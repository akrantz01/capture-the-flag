# Capture The Flag
###### By [Alex Krantz](https://github.com/akrantz01) and [Kai Fronsdal](https://github.com/kaifronsdal)

## Description
A continuous multiplayer capture the flag game built with [BabylonJS](https://github.com/BabylonJS/Babylon.js) and [Golang](https://golang.org). BabylonJS is the rendering engine and physics stimulator we are using. The multiplayer server is written in Golang and loosely based off of another project called [MMOS](https://github.com/akrantz01/mmos).

## Running It
### On Heroku
Coming soon...

### On Self-Hosted
* Download a server binary from the [releases](https://github.com/akrantz01/capture-the-flag/releases) tab
  * The naming scheme is: `capture-the-flag.[OS].[arch]`
  * For Windows 64-bit, this would be: `capture-the-flag.win.amd64.exe`
* Also download the game files called `game.zip`
* Create a new folder and move `game.zip` and the server binary into it
* Unzip `game.zip` in that directory
* Find the folder named `public` and make sure it is at the same level as the server binary
* Run the server binary
    * You will most likely want to run it with the arguments `--host 0.0.0.0 --port 8080`
    * See below for the server arguments
* Navigate to your server's IP address

## Server Configuration
| Flag    | Default   | Purpose                  |
|---------|-----------|--------------------------|
| --host  | 127.0.0.1 | The address to listen on |
| --port  | 8080      | The port to listen on    |
| --debug | false     | Enable debugging         |
