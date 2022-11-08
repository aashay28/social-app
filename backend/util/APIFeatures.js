const User = require("../models/users");

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    lastMessage(userId) {
        if (this.queryString.lastMessage) {
            // this.query = this.query.select("-password -createdAt -updatedAt");
            this.query = User.lastMessage(userId);
        }
        return this;
    }

    search() {
        if (this.queryString.search) {
            this.query = this.query.find({ "name": { '$regex': this.queryString.search, '$options': 'i' } });
        }
        return this;
    }
    filter() {
        const queryObj = {...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    isOnline() {
        if (this.queryString.isOnline) {
            this.query = this.query.find({ isOnline: true });
        }
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }



}
module.exports = APIFeatures;