/* Create a function to add student data to an array as an array of 
objects and render objects to the page

Be sure your function parameters are given strict types

*/

/* Define your data structure using a custom Type.
https://www.digitalocean.com/community/tutorials/how-to-create-custom-types-in-typescript

Student
    First name (string)
    Last name (string)
    Course  (string)
    Grade (number or string)
    isPassing (boolean value if grade is greater than a D)

    If student is passing, render a green symbol/icon next to their entry in the table
    If student is not passing, render a red symbol/icon next to their entry in the table

    It is up to you to calculate based on grade (numerical or letter) if student is passing or not


    Data should be rendered in the form of a table, i.e.,

    |First Name|Last Name|Course|Grade (as Letter)|Passing?|
    | Leon     |Kennedy  |RE-101|  B              |   :)   |


    Add a button that sorts the data based on Grade (ascending order)
    Add a button that sorts teh data based on Course (ascending order)
*/

//Interface Student that has name, course, grade, passing

//Class with a list of students, enum of sorts (NAME_ASC, NAME_DESC, GRADE_ASC, GRADE_DESC)

//Func that adds new student to list with params (name, course, grade)
//-Stores in local storage using JSON.stringify(testObject))

//Func that loads list of students with data from localStorage

//

//Func that displays students in html (with optional list for sorted lists)
//- Displays in order added by default

//Func that sorts depending on sort enum, and then calls display 

interface Student {
    name: string;
    course: string;
    grade: number;
    passing: boolean;
    id: number;
}

enum Sort {
    NAME_ASC,
    NAME_DESC,
    GRADE_ASC,
    GRADE_DESC,
}

class StudentRecord {
    students: Student[] = [];

    addStudent(): void {
        //First we get the values from the form that was submitted
        let name = (<HTMLInputElement>document.querySelector('#student-name'))!.value;
        let course = (<HTMLInputElement>document.querySelector('#student-course'))!.value;
        let grade = (<HTMLInputElement>document.querySelector('#student-grade'))!.value;

        //Then we create a new object to place into localStorage
        let passing = (parseInt(grade) >= 70 ? true : false);
        let newStudent = {
            name: name,
            course: course,
            grade: grade,
            passing: passing,
            id: this.students.length,
        }

        //console.log(newStudent)
        //Finally, we add the item into local storage, with an ID of however many objects are currently in this.students (starts at 0)
        //After that, we call displayStudent()
        localStorage.setItem(`student${this.students.length}`, JSON.stringify(newStudent))
        this.displayStudent(false);
    }

    displayStudent(sorted: boolean, sortedStudents?: Student[]): void {
        //First, we fill this.students with all of the information from local storage
        let keys = Object.keys(localStorage)
        //console.log(keys);
        let keyNum = keys.length;
        let index = 0;

        this.students = [];
        keys.sort().forEach((key) => {
            this.students.push(JSON.parse(localStorage.getItem(key) || '{}'))
        })
        console.log(keys);
        console.log(this.students);
        console.log(sortedStudents);

        //Then, we fill the student display with new elements containing all the information you need
        const studentDisplay = <Element>document.querySelector('.student-display');
        studentDisplay.innerHTML = '';
        for (let student of (sorted ? sortedStudents! : this.students)) {
            index = this.students.findIndex(item => item.id === student.id)
            console.log(index);
            let newStudent = document.createElement('div');
            newStudent.classList.add('student');
            newStudent.classList.add(`${keys[index]}`);
            newStudent.innerHTML = `
            <div class="name">${student.name}</div>
            <div class="course">${student.course}</div>
            <div class="grade">${student.grade}
            <input type="number" value="${student.grade}" class="edit-field" style="display:none">
            <input type="button" value="Edit" class ="grade-edit">
            <input type="button" value="OK" class="update-grade" style="display:none"></div>
            <div class="passing"><i class="fas ${student.passing ? 'fa-check' : 'fa-times'}"></i></div>
            <input type="button" value="Remove" class="remove-student">
            `

            studentDisplay.appendChild(newStudent);
            index++;
        }
        //For each of the new divs we created, we need to add event listeners to the remove and edit buttons
        let delButtons = document.getElementsByClassName('remove-student');
        for (let button of delButtons) {
            button.addEventListener('click', () => {
                this.removeStudent(button);
            });
        }
        //Edit buttons are a littlle more complicated cuz we need to move some other stuff out of the way, and then replace with the new edit form;
        let editButtons = document.getElementsByClassName('grade-edit');
        for (let button of editButtons) {
            button.addEventListener('click', () => {
                let editField = button.previousElementSibling as HTMLElement;
                let okButton = button.nextElementSibling as HTMLElement;
                let gradeDiv = button.parentElement;
                editField.style.display = "inline";
                okButton.style.display = "inline";
                gradeDiv!.textContent = "";
                gradeDiv?.appendChild(editField);
                gradeDiv?.appendChild(okButton)
            })
        }
        let updateButtons = document.getElementsByClassName('update-grade');
        for (let button of updateButtons) {
            button.addEventListener('click', () => {
                this.updateGrade(button);
            })
        }
    }

    removeStudent(delButton: Element): void {
        //console.log(delButton);
        let studentIndex = delButton.parentElement;
        let storageIndex = (<Element>studentIndex).classList[1];
        let index = parseInt(storageIndex[storageIndex.length - 1])
        //console.log(studentIndex)
        console.log(index);

        //localStorage.removeItem(storageIndex)
        this.students.splice(index, 1)
        console.log(this.students);
        localStorage.clear();
        let counter = 0;
        for (let student of this.students) {
            localStorage.setItem(`student${counter}`, JSON.stringify(student))
            counter++
        }


        this.displayStudent(false);
    }

    updateGrade(editButton: Element): void {
        //First, we get the index of the button that was pressed, so that we can change the value in this.students
        let studentIndex = editButton.parentElement!.parentElement;
        let storageIndex = (<Element>studentIndex).classList[1];
        let index = parseInt(storageIndex[storageIndex.length - 1]);
        //Then we take the new grade from the input field, and turn it into an integer to place in this.students at the index we found earlier
        let gradeField = editButton.previousElementSibling as HTMLInputElement;
        let newGrade = parseInt(gradeField.value);
        
        this.students[index].grade = newGrade;
        console.log(this.students[index])

        //Finally, we put it into localStorage in the same spot as storageIndex;
        localStorage.setItem(storageIndex, JSON.stringify(this.students[index]));

        //And then, we rebuild the list;
        this.displayStudent(false);
    }

    sortStudents(sortEnum: string): void {
        //console.log(sortEnum)
        //This one's fairly simple. Depending on the sort-style, we create a new list of student objects, sort them accordingly, and display students with that sorted list
        let sortedStudents: Student[] = [];
        if (sortEnum == 'NAME-ASC') {
            sortedStudents = this.students.sort(function (a, b) { if (a.name === b.name) { return a.course > b.course ? 1 : -1 } return a.name > b.name ? 1 : -1 })
            this.displayStudent(true, sortedStudents);
        }
        else if (sortEnum == 'NAME-DESC') {
            sortedStudents = this.students.sort(function (a, b) { if (a.name === b.name) { return a.course > b.course ? 1 : -1 } return a.name < b.name ? 1 : -1 })
            this.displayStudent(true, sortedStudents);
        }
        else if (sortEnum == 'GRADE-ASC') {
            sortedStudents = this.students.sort((a, b) => (a.grade > b.grade) ? 1 : -1);
            this.displayStudent(true, sortedStudents);
        }
        else if (sortEnum == 'GRADE-DESC') {
            sortedStudents = this.students.sort((a, b) => (a.grade < b.grade) ? 1 : -1);
            this.displayStudent(true, sortedStudents);
        }
        else if (sortEnum == 'NORMAL-SORT') {
            this.displayStudent(false);
        }
    }
}

let record = new StudentRecord();
record.displayStudent(false);

//This handles if a form submission is made
let studentForm = <HTMLFormElement>document.querySelector('#add-student');
let submitStudent = <Element>document.querySelector('#add-student .submit-button');
submitStudent.addEventListener('click', () => {
    record.addStudent()
    studentForm.reset();
})

//This handles if someone wants to sort. Lots of querySelectors
let nameAsc = document.querySelector('i.name-asc');
let nameDesc = document.querySelector('i.name-desc');
let gradeAsc = document.querySelector('i.grade-asc');
let gradeDesc = document.querySelector('i.grade-desc');
let normalSort = document.querySelector('i.normal-sort');

let sorts = [nameAsc, nameDesc, gradeAsc, gradeDesc, normalSort]

for (let sorter of sorts) {
    let sortType = (sorter?.classList[2])?.toUpperCase()

    sorter?.addEventListener('click', () => {
        record.sortStudents(sortType!);
    })
}