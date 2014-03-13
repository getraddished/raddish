/**
 * Raddish Specs.JS
 *
 * This will hold the specifications.
 *
 * Specs:
 * - Data oriented:
 *      This means that the framework will ONLY handle data. And will thus ONLY return data upon request.
 *      Maybe behaviors but this is furure music.
 *
 * - RESTful:
 *      This means that it can handle HTTP verbs (e.g.: GET, POST, PUT, DELETE)
 *      And will start the appropriate controller/ model.
 *      The current level is: RESTful Level 2
 *      Level 3 is planned, But this has to be thought out.
 *
 * - MVC:
 *      This framework for development purposes will incorperate the MVC triat.
 *      So you have the Controller -> Model -> View (Json, etc.)
 *      Unlike the first version this version will not hold a row/ rowset object. Because we stream it means that everything will be a row.
 *
 * - Chain of Command:
 *      This will imply that the framework will be able to handle behaviors.
 *      Behaviors can be called on data to do "extra" functions.
 *
 * - Error Handeling:
 *      Return the thrown error, with correct statuscode.
 *
 */

/**
 * Router
 *
 * - Responsibility:
 *      The router is responsible for routing the request throught to the dispatcher.
 *      If the request is a static file then it has to return the file. (When GZIP is supported gzip compressed.)
 *
 * - Functions:
 *      constructor:
 *          Get the dispatcher and pipes the request to the dispatcher.
 *
 *      getDispatcher:
 *          Returns the dispatcher for the request.
 *
 *      parseRequest:
 *          Parses the request and make an object with the requested values.
 *
 *      checkGZip:
 *          check if the client accepts GZIP encryption
 *
 * - Information:
 *      The urls are as follows: http://example.com:1337/<application>/<component>/<view>?<state>=<value>
 */

/**
 * Dispatcher
 *
 * - Responsibility:
 *      Make sure the request is piped to the correct Controller for further handeling.
 *
 * - Functions:
 *      constructor:
 *          Define the readable type.
 *
 *      dispatch:
 *          Get the controller, check if the permissions are correct, if not issue a 401 Error.
 *          If the permission is correct pipe the request to the controller.
 *
 *      getController:
 *          Get the correct controller from the request.
 */

/**
 * Controller
 *
 * - Responsibility:
 *      To get the correct view and model and pipe these together.
 *
 * - Functions:
 *      TODO: Fill in the rest.
 */