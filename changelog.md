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