## Unreleased

Time for another feature release.
We have added a CLI tool through which you can install applications and components,
this CLI tool can also load in a file called ```install.json``` and install all the applications and
components listed in here.

Added:
- CLI tool to install applications and components from git.

Fixed:
- Rewritten Threads object

## 2.4.0 (2014-02-19)

For this time we have another feature release.

We have improved the router to add more powerful router and added complete support for iojs and NodeJS 0.12.

Added:
- Support for iojs and nodejs 0.12

Fixed:
- Improved Router

## 2.3.0 (2015-01-13)

Another release of Raddish. 
This time some minor changes.

We have done some work on the performance of Raddish and the table object. 
The table methods have been split up only using the specific actions and the rest is parsed in the execute method.

Also we have added an EmberJS layout which you can use with your EmberJS projects.

Added:
- EmberJS view

Fixed:
- Rewritten Table object

## 2.2.0 (2014-10-12)

After some time we have released a new version of Raddish 
which packs some minor extra features.

Added:
- Separated query builder (([universal query](http://npmjs.org/package/universal-query)))
- SQLite database adapter
- More core behaviors

Fixed:
- Test coverage

## 2.1.0 (2014-09-03)

This is another feature release. 
In this version we have the following changes.

Added:
- ObjectLoader.require to require files through an identifier
- Logging layer


Fixed:
- DCI Implementation

## 2.0.0 (2014-07-20)

This the second major release for public use.

We have changed a lot in this version. 

Added:
- System and Application plugins
- Object Locators
- Filters
- Unified query builder

Fixed:
- Changed identifiers
- Removed request and response flowing through the entire system

Deleted:
- Service is renamed to ObjectManager

## 1.1.0 (2014-07-01) 

This the second stable release for public use. 
This release hold a lot of features and speed improvements. And more cache control.

Also thanks to the loader sequence you can chose which object the framework needs to load when. 
This can be very handy when you want to inject a component no matter what.

Also there now is a config variable called cache. 
When this is enabled the framework will cache all the objects improving speed greatly. 
It is possible to prevent an object from being cached by adding this.cache = false. to the object its constructor.

Added: 
- Cache control
- MongoDB database adapter

Fixed:
- Speed improvement

## 1.0.0 (2014-06-18)

Finally we are releasing version 1.0.0,
In this release only bugfixes will be done. No more extra features.

This release will hold some extra's to make life a lot more easy with the use of Component Config. 
Also we have socketio integrated into the core of the framework.

From now on we will be focussing on version 2.

Added:
- Socketio Integration
- Component Config
- Behavior Config

## 0.6.0 (2014-05-13)

A Mixin object has been implemented so it will be easier to mixin objects.

Added:
- Mixin Object

## 0.5.0 (2014-05-07)

This time there was a mayor cleanup and together with that a mayor speed increase. 
Next to this there are no great changes.

Fixed:
- Improved readability
- Cleanup code
- Improved speed

## 0.3.0 (2014-04-24)

Now it is time for the third public beta and most likely the last step before the official release. 
This version ofcourse holds some improvements in usage and speed.

One of the biggest parts that we have implemented is the Threads object which automatically scales processes. 
The configuration options available are:

- maxThreads: The maximal amount of threads the object can start.
- maxThreshold: What is the maximum cpu usage before creating a new process.
- minThreshold: What is the minimal cpu usage to kill a process
- interval: the time to wait between checks
Further this object is maintaince free.

Added:
- Threads object

Fixed:
- Base object renamed to Service and changes
- Speed improvements

## 0.2.0 (2014-04-07)

This is the second public beta released. 
The following features new are now available.

Added:
- Application layer
- Application detection
- Component detection

Fixed:
- Speed improvements

## 0.1.0 (2014-03-18)

This is the first public alpha released. 
The following features are now available.

Added:
- Behaviours(DCI) to the controller
- Basic routing between files and framework requests

Fixed:
- MVC component structure