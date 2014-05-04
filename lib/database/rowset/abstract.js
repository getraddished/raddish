var Service = require('../../service/service');
var util    = require('util');

function RowsetAbstract() {
    RowsetAbstract.super_.apply(this, arguments);

    this.rows = [];
}

util.inherits(RowsetAbstract, Service);

/**
 * This function will set the data in the Rowset object,
 * This eccepts a array, for every entry it will create Row object and add it to the rows array
 *
 * @method setData
 * @param {Object} data The data to set on the object
 * @returns {Promise} Returns the Rowset object with filled data
 */
RowsetAbstract.prototype.setData = function (data) {
    var self = this;

    // TODO: There is stilla bug over here.
    return new Promise(function (resolve, reject) {
        self.getRow()
            .then(function (row) {
                for(var index in data) {
                    var rowObj = row.clone();
                    self.rows.push(rowObj.setData(data[index]));
                }

                resolve(self);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};

/**
 * This function will return only the data from the Rowset object
 *
 * @method getData
 * @returns {Promise} The data of the Rowset object
 */
RowsetAbstract.prototype.getData = function () {
    var self = this;
    var data = [];

    for(var index in this.rows) {
        data.push(this.rows[index].getData());
    }

    return data;
};

RowsetAbstract.prototype.getRow = function() {
    var identifier = this.getIdentifier().clone();

    return this.getService(identifier.setPath(['database', 'row']), null);
}

module.exports = RowsetAbstract;