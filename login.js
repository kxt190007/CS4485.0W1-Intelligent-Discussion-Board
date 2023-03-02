class Login {
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
                //do login api
                localStorage.setItem("auth", 1);
                window.location.href = "https://hackertyper.net/"

            } else {
                console.log("fail");
            }
            console.log(inputUser.value);
            console.log(inputPass.value);
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

const formLog = document.querySelector(".loginForm");

if (formLog) {
    const fields = ["LogE", "LogP"];
    const validator = new Login(formLog, fields);
}

