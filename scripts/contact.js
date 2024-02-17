"use strict";

(function(core) {

    class Contact {

        constructor(fullname = "", contactNumber = "", emailAddress = "") {
            this._fullname = fullname;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        get fullname() {
            return this._fullname;
        }

        set fullname(value) {
            this._fullname = value;
        }

        get contactNumber() {
            return this._contactNumber;
        }

        set contactNumber(value) {
            this._contactNumber = value;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(value) {
            this._emailAddress = value;
        }

        toString() {
            return `FullName ${this._fullname}
            ContactNumber ${this._contactNumber}\n EmailAddress ${this._emailAddress}`;
        }

        serialize() {
            if (this._fullname !== "" && this._contactNumber !== "" && this._emailAddress !== "") {
                return `${this.fullname}, ${this.contactNumber}, ${this.emailAddress}`;
            }
            console.error("one or more of the contact properties are missing or invalid");
            return null;
        }

        /**
         * Deserialize means to read date from localStorage
         */


        deserialize (data){
            //Bruce Wayne, 555-5555, bruce@batman.com
            let propertyArray = data.split(",");
            this._fullname = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }

    core.Contact = Contact;
})(core || (core ={}));
