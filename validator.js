//Cách hoạt động 
/*
-Khai báo rule và tạo function với return object { select :".." và test : function(data)}
-Duyệt tất cả rules để cho rules vào 1 object { tên thẻ input : các func test} ,
-  Tạo object rỗng ròi chuyển thành mảng object rỗng để thêm rule
-Duyệt tất cả rules rồi tìm tất cả thẻ input có id hoặc class giống với rules và thêm event blur or input and validate
-  tạo validate với tham số object rules với thẻ input trùng với object rules selector
- duyệt objecr  rỗng đã tạo ròi từ thẻ input tìm thằng cha chưa nó và tìm message div
- tạo 1 biến để lưu mảng rule từ mảng object rule theo object selector của rule
- Lấy input value từ thẻ input nhận từ tham số ròi loop qua mảng rule ròi chuyền vào func test của rule để check

*/



//Vừa là hàm cx như là object
function Validator(options) {

    function getParents(element, selector) {
        // var errorElement=getParent(inputElement,'.form-group')


        // Tìm thằng cha to nhất của element
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }

            element = element.parentElement;
        }


    }

    var selectorRules = {};

    function validate(inputElement, rule) {
        // var errorMessage = rule.test(inputElement.value);

        //Tù thằng cha lớn nhất của element chọc vào phần tử con cần tìm
        var errorMessage;
        const errorElement = getParents(inputElement, options.formGroup).querySelector(options.errorSelector);
        // inputElement.parentElement.querySelector(options.errorSelector);
        // inputElement.closet(options.errorSelector);
        // console.log(inputElement.closest('.form-group'));
        // console.log(selectorRules[rule.selector]);

        //*Xử lí nhiều rule
        var rules = selectorRules[rule.selector];

        //Lặp nếu có rule lỗi thì break
        for (let index = 0; index < rules.length; index++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    // chỉ cần có data ko cần phải có value
                    errorMessage = rules[index](
                        formElement.querySelector(rule.selector + ':checked')
                    );

                    break;
                default:

                    errorMessage = rules[index](inputElement.value);
                    break;
            }
            // console.log(rules[index]( inputElement.value));
            if (errorMessage) {
                // nếu mà rule trả về message thì break
                // falsy ở đây là undefined và truthy là message
                // console.log(errorMessage);
                break;
            }

        }
        // errorMessage đúng nghĩa là validate sai
        // nếu mà rule trả về errorMessage thì  hiện thông bóa lỗi
        if (errorMessage) {
            // Trỏ ra thằng cha của thằng blur ròi từ thằng đấy tim thằng con ngang hàng với element bị blur
            // console.log(e.target.parentElement.querySelector('.form-message'));
            // console.log(errorMessage);
            errorElement.innerText = errorMessage;
            getParents(inputElement, options.formGroup).classList.add('invalid');


        } else {
            errorElement.innerText = "";

            getParents(inputElement, options.formGroup).classList.remove('invalid');
        }
        // console.log(!errorMessage);
        return !errorMessage; // chấm than là cho về dạng boolean và falsy


        // console.log(selectorRules);


    }


    var formElement = document.querySelector(options.form);
    if (formElement) {

        //*Khi submit form thì bỏ hành động mặc định
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isSuccess = true;

            //* Khi submit form thì validation đồng thời 4 input 
            options.rules.forEach((cur) => {
                // querySelector  bắt đầu tìm từ form element
                var inputElement = formElement.querySelector(cur.selector);

                var isValid = validate(inputElement, cur); // trả về message là false
                // Chỉ cần rule 1 lỗi gì ko submit dc 
                if (!isValid) {
                    isSuccess = false;
                }

            })
            if (isSuccess) {
                if (typeof options.onSubmit === 'function') {
                    // chọn tất cả thẻ có attribute là name và ko có attribute là disable
                    var formInput = formElement.querySelectorAll('[name]:not([disabled])');

                    //Convert từ NodeList sang Array
                    var formValue = Array.from(formInput).reduce(function (values, cur) {
                        switch (cur.type) {
                            case 'checkbox':
                                if(!cur.matches(':checked')){
                                    values[cur.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[cur.name]) ){
                                    values[cur.name] = [];
                                }
                                values[cur.name].push(cur.value);
                                break;
                                case 'radio':
                                //Lấy name của thằng radio làm attribute và gán value thông quá querySelector
                                values[cur.name] = formElement.querySelector('input[name="'+cur.name+'"]:checked').value;
                           
                                break;
                                case 'file':
                                    values[cur.name] = cur.files;
                                    break;
                            default:
                                //Gán attributes = value cho object
                                values[cur.name] = cur.value;

                                break;
                        }

                        // && nếu khác false thì chuyển sang bên phải nếu false thì lấy
                        return values;
                    }, {});

                    options.onSubmit(formValue);
                    // console.log(formValue);

                }
            }


        }


        //*Xử lí nhiều rule
        options.rules.forEach((cur) => {

            //*Xử lí nhiều rule
            //Lưu lại các rules trong mỗi input
            if (Array.isArray(selectorRules[cur.selector])) {
                selectorRules[cur.selector].push(cur.test);
            } else {
                selectorRules[cur.selector] = [cur.test];
            }

            // querySelector  bắt đầu tìm từ form element
            var inputElements = formElement.querySelectorAll(cur.selector);
            // console.log(inputElements);
            
            //Sử dụng trong trường hợp mảng 1 có elenment hoặc nhiều element
            Array.from(inputElements).forEach((inputElement) => {
                // console.log(inputElement);
                // blur là khi bấm vào element ròi bấm ra element khác
                //* Khi blur input
                // console.log(inputElement);
                inputElement.onblur = (e) => {
                    // console.log(cur); //lấy value input/
                    // console.log(cur.test(e.target.value));
                    // var  errorElement =cur.test(e.target.value)
                    // console.log(errorMessage);
                        validate(inputElement, cur);

                };

                //* Khi người dùng nhập input
                inputElement.oninput = (e) => {
                    // console.log(cur); //lấy value input/
                    // console.log(cur.test(e.target.value));
                    const errorElement =
                        getParents(inputElement, options.formGroup).querySelector(options.errorSelector);
                    errorElement.innerText = "";
                    getParents(inputElement, options.formGroup).classList.remove('invalid');
                }
            });

            //* Thằng input nào dc gán sự kiện blur or input thì mời dc validate
            // if (inputElement) {
            // }
        });
    }


}


// Định nghĩa rules
//Khi có lỗi => trả ra messages lỗi
// Khi hợp lệ =? ko trả về cái gì

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (data) {
            return data.trim() ? undefined : message || "Vui lòng nhập thông tin";
        },
    };
};
Validator.isRequired1 = function (selector, message) {
    return {
        selector: selector,
        test: function (data) {
            // console.log(data);
            return data ? undefined : message || "Vui lòng nhập thông tin";
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (data) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(data) ? undefined : message || "Thông tin nhập phải là email";
        },
    };
};

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (data) {
            return data.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        },
    };
};

Validator.isRePass = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (data) {
            // const similar = document.querySelector('#password');
            return data === getConfirmValue() ? undefined : message || "Vui lòng nhập lại mật khẩu";
        },
    };
};

