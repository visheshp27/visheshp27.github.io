"use strict";

// IIFE - Immediately invoked functional expression
(function () {

    function CheckLogin(){

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#">
                                    <i class="fa-sign-in-alt"></i> Logout</a>`)
        }

        $("#logout").on("click", function () {
            sessionStorage.clear();
            location.href = "login.html";

        });

    }


    function LoadHeader(html_data)
    {
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        CheckLogin();
    }



    function AjaxRequest(method, url, callback) {


        let xhr = new XMLHttpRequest();


        //Step 2: Open XHR request
        xhr.open(method, url);

        //Step 4: Add event
        xhr.addEventListener("readystatechange", () => {

            if(xhr.readyState === 4 && xhr.status === 200){

                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("Error: callback not a function");
                }

            }


        });

        xhr.send();
    }

    function ContactFormValidation() {
        validateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please enter a valid full name");

        validateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid contact Number");

        validateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email Address");
    }

    function validateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger");
                messageArea.text(error_message);
                messageArea.show();
            } else {
                messageArea.removeAttr("class");
                messageArea.hide();
            }
        });
    }

    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }

    function DisplayHomePage() {
        console.log("Called DisplayHomePage...");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html";
        });

        $("main").append('<p id="MainParagraph" class="mt-3">This is my paragraph</p>');

        $("body").append(`<article class="container">
            <p id="ArticleParagraph" class="mt-3">This is my Article paragraph</p>
            </article>`);
    }

    function DisplayProductPage() {
        console.log("Called DisplayProductPage");
    }

    function DisplayServicePage() {
        console.log("Called DisplayServicePage");
    }

    function DisplayAboutPage() {
        console.log("Called DisplayAboutPage");
    }

    function DisplayContactPage() {
        console.log("Called DisplayContactPage");
        ContactFormValidation()

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckBox");

        sendButton.addEventListener("click", function () {
            if (subscribeCheckbox.checked) {
                AddContact(document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("email").value);
            }
        });
    }

    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let index = 1;
            let keys = Object.keys(localStorage);
            for (const key of keys) {
                let contact = new Contact();
                let contactData = localStorage.getItem(key);
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        <td><button value="${key}" class="btn btn-primary btn-sm edit">
                        <i class="fas fa-edit fa-sm"> Edit </i>
                        </button></td>
                        <td><button value="${key}" class="btn btn-danger btn-sm delete">
                        <i class="fas fa-trash fa-sm"> Delete </i>
                        </button></td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }

        $("#addButton").on("click", () => {
            location.href = "edit.html#add";
        });

        $(document).on("click", "button.edit", function () {
            location.href = "edit.html#" + $(this).val();
        });

        $(document).on("click", "button.delete", function () {
            if (confirm("Confirm contact deletion?")) {
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });
    }

    function DisplayEditPage() {
        console.log("Called DisplayEditPage...");
        let page = location.hash.substring(1);
        switch (page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html('<i class="fa fa-plus fa-sm">Add</i>');

                $("#editButton").on("click", (event) => {
                    // prevent form submission
                    event.preventDefault();
                    AddContact(document.getElementById("fullName").value,
                        document.getElementById("contactNumber").value,
                        document.getElementById("emailAddress").value);
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });
                break;
            default:
                // edit operation
                let contact = new Contact();
                contact.deserialize(localStorage.getItem(page));

                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);

                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();

                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });
                break;
        }
    }

    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage");

        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function () {

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function(data){


                for(const user of data.users) {
                    console.log(data.user);
                    if(username.value === user.Username && password.value === user.Password){

                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                if(success) {

                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();

                    location.href = "contact-list.html";

                }else{
                    $("#user").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }

                $("#cancelButton").on("click", function () {

                    document.forms[0].reset();
                    location.href = "index.html"
                });

            });


        });

    }

    function DisplayRegisterPage() {
        console.log("called DisplayRegisterPage");

    }
    function Start() {
        console.log("App Started...");

        AjaxRequest("Get", "header.html", LoadHeader);



        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "service":
                DisplayServicePage();
                break;
            case "products":
                DisplayProductPage();
                break;
            case "Contact-List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;

        }
    }
    window.addEventListener("load", Start);
})();
