class SignUp {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
    }

    validateonSubmit() {
        let self = this;
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            var error = 0;
            let user = self.fields[0];
            const inputUser = document.querySelector(`#${user}`);
            let pass = self.fields[1];
            const inputPass = document.querySelector(`#${pass}`);
            if (self.validateUser(inputUser) == false) {
                error++;
            }
            if (error == 0) {
                if (self.validatePass(inputPass) == false) {
                    error++;
                }
            }
            if (error == 0) {
                console.log("succ");
                //authorize with database, place user and pass in there
            } else {
                console.log("fail");
            }
        });
    }

    validateUser(field) {
        if (field.value.trim() == "") {
            alert("username is empty!");
            return false;
        }
        return true;
    }
    validatePass(field) {
        if (field.value.trim() == "") {
            alert("password is empty!");
            return false;
        }
        if (field.value.length < 8) {
            alert("password is less than 8 chars!");
            return false;
        }
        return true;
    }
}

const formSign = document.querySelector(".signUpForm");

if (formSign) {
    const fields = ["SignE", "SignP"];
    const validator = new SignUp(formSign, fields);
}
