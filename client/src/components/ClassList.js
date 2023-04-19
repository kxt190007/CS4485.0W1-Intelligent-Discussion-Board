import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button'
import { Divider, Grid, Typography, Box, InputLabel, TextField, Paper } from '@mui/material'

export async function loader({ params }) {
    console.log(params.classID)
    //const classInfo = await getClass(params.classID);
    return params.classID
}
export function ClassList() {

    const [className, setClassName] = useState("");
    const [instructorList, setInstructorList] = useState([[]])
    const [studentList, setStudentList] = useState([])
    const [moderatorList, setModeratorList] = useState([])
    const [studentLabel, setStudentLabel] = useState("")
    const [moderatorLabel, setModeratorLabel] = useState("")
    const [instructorLabel, setInstructorLabel] = useState("")
    const [addStudent, setAddStudent] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const classID = useLoaderData();
    const navigate = useNavigate()
    const [classString, setClassString] = useState("")
    const [selectedFile, setSelectedFile] = useState()
    const [isFilePicked, setIsFilePicked] = useState(false)
    const [errMessage1, setErrMessage1] = useState("")
    const [fileName, setFileName] = useState("")
    const [fileList, setFileList] = useState([])
    const [objectURL, setObjectURL] = useState("")
    const [fetchDone, setFetchDone] = useState(false)
    async function getStudents(credentials) {
        return fetch("http://localhost:5000/getStudents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    async function promote(credentials) {
        return fetch("http://localhost:5000/promote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    async function demote(credentials) {
        return fetch("http://localhost:5000/demote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    async function remove(credentials) {
        return fetch("http://localhost:5000/removeStudent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    async function addToClass(credentials) {
        return fetch("http://localhost:5000/addToClass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    async function generate(credentials) {
        return fetch("http://localhost:5000/generateNewString", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }
    useEffect(() => {
        async function fetchData() {
            const token = await getStudents({
                classID,
            });

            console.log(token.instructors)
            console.log(sessionStorage.getItem('token'))
            var found = 0
            for (let i = 0; i < token.instructors.length; i++) {
                if (token.instructors[i][0] == sessionStorage.getItem('token')) {
                    found = 1
                }
            }
            if (found === 1) {
                setClassName(token.classname)
                setClassString(token.classstring)
                const temp = [...token.instructors]
                setInstructorList(temp)
                const temp1 = [...token.students]
                setStudentList(temp1)
                const temp2 = [...token.moderators]
                setModeratorList(temp2)
                setStudentLabel("Students")
                setModeratorLabel("Moderators")
                setInstructorLabel("Instructors")
            }
            else {
                navigate("/")
            }
            getFiles()
            setFetchDone(true)
        }
        fetchData();
    }, []);
    const generateNewString = async () => {
        const token = await generate({
            classID,
        })
        setClassString(token.classstring)
    }
    const demoteStudent = async (index) => {
        const token = await demote({
            studentID: moderatorList[index][0],
            classID,
        })
        const student = moderatorList[index]
        const temp = [...moderatorList]
        temp.splice(index, 1)
        setModeratorList(temp)
        const temp1 = [...studentList, student]
        setStudentList(temp1)
    }
    const promoteStudent = async (index) => {
        const token = await promote({
            studentID: studentList[index][0],
            classID,
        })
        const student = studentList[index]
        const temp = [...studentList]
        temp.splice(index, 1)
        setStudentList(temp)
        const temp1 = [...moderatorList, student]
        setModeratorList(temp1)
    }
    const removeClassM = async (index) => {
        const token = await remove({
            studentID: moderatorList[index][0],
            classID,
        })
        const temp = [...moderatorList]
        temp.splice(index, 1)
        setModeratorList(temp)
    }
    const removeClassS = async (index) => {
        const token = await remove({
            studentID: studentList[index][0],
            classID,
        })
        const temp = [...studentList]
        temp.splice(index, 1)
        setStudentList(temp)
    }
    const addStudentClass = async (event) => {
        setErrMessage("")
        var found = 0
        for (let i = 0; i < studentList.length; i++) {
            if (studentList[i][2] == addStudent) {
                found = 1
            }
        }
        for (let i = 0; i < moderatorList.length; i++) {
            if (moderatorList[i][2] == addStudent) {
                found = 1
            }
        }
        if (found == 1) {
            setErrMessage("Student already in class")
        }
        else {
            const token = await addToClass({
                email: addStudent,
                classID,
            })
            if (token.status === "Failed") {
                setErrMessage(token.message)
            }
            else {
                const temp = [...studentList, token.student]
                setStudentList(temp)
            }
        }
    }
    const fileChange = (event) => {
        setSelectedFile(event.target.files[0])
        setIsFilePicked(true)
        if (event.target.files[0]) {
            setFileName(event.target.files[0].name)
        }
    }
    const addFile = async (e) => {
        e.preventDefault()
        setErrMessage1("")
        var data = new FormData()
        data.append('file', selectedFile)
        data.append('filename', fileName)
        data.append('classid', classID)
        const token = await fetch('http://localhost:5000/file', {
            method: 'POST',
            body: data
        }).then((response) => response.json()
            .then((responseData => {
                getFiles()
                if (responseData.status == "Failed") {

                    setErrMessage1(responseData.message)
                }
                else {
                    setFileName("")
                    setIsFilePicked(false)
                    setSelectedFile(null)
                    document.getElementById("file").value = null
                }
            })))


    }
    const getFiles = async () => {
        const token = await fetch('http://localhost:5000/getFiles', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                classID,
            })
        }).then((response) => response.json()
        )
        const resources = token.Resource
        const temp = []
        for (let i = 0; i < resources.length; i++) {
            temp.push(
                <p>
                    <Button onClick={() => getFile(resources[i][3])}>{resources[i][1]}</Button>
                    <Button onClick={() => deleteFile(resources[i][0], resources[i][3])}>Delete</Button>
                </p>
            )
        }
        setFileList(temp)
    }
    const getFile = async (filePath) => {
        await fetch('http://localhost:5000/getFile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filePath,
            })
        }).then((response) => response.blob())
            .then((blob) => {
                console.log(blob)
                const objURL = URL.createObjectURL(blob)
                console.log(objURL)
                setObjectURL(objURL)
            })

    }
    const deleteFile = async (fileID, filePath) => {
        await fetch('http://localhost:5000/deleteFile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileID,
                filePath,
            })
        }).then((response) => response.json()
            .then((responseData => {
                getFiles()
            })))
    }
    if (sessionStorage.getItem('accesslevel') != 5) {
        return <Navigate replace to="/" />
    }
    else if(fetchDone) {
        return (
            <div>
                <Grid>
                    <Layout />

                    <Box sx={{ width: '100%', maxWidth: 1870, bgcolor: 'background.paper', marginLeft: 2, marginTop: 9 }}>

                        <Typography variant="h4" fontWeight='bold'>
                            {className}

                            <Button color="inherit" style={{ marginLeft: '1185px' }}>
                                <Link to={"/classes/"}>Back to Classes</Link>
                            </Button>
                        </Typography>

                        <br />
                        <br />
                        <Typography variant="h6" fontWeight='bold'>
                            {instructorLabel}
                        </Typography>

                        {instructorList.map((prof, index) => (
                            <Typography variant="body1" component="div" key={index}>
                                {`${prof[3]} ${prof[4]}`}
                            </Typography>
                        ))}
                        <br />

                        <Typography variant="h6" fontWeight='bold'>
                            {moderatorLabel}
                        </Typography>

                        {moderatorList.map((moderator, index) => (
                            <div key={index}>
                                <Typography variant="body1" component="div">
                                    {`${moderator[3]} ${moderator[4]}`}
                                </Typography>
                                <Button variant="contained" color="primary" size="small" onClick={() => demoteStudent(index)}>
                                    Demote to student
                                </Button>
                                <Button variant="contained" color="error" size="small" onClick={() => removeClassM(index)}>
                                    Remove from class
                                </Button>
                            </div>
                        ))}
                        <br />

                        <Typography variant="h6" fontWeight='bold'>
                            {studentLabel}
                        </Typography>

                        {studentList.map((student, index) => (
                            <div key={index}>
                                <Typography variant="body1" component="div">
                                    {`${student[3]} ${student[4]}`}

                                    <Button variant="contained" color="primary" size="small" onClick={() => promoteStudent(index)}>
                                        Promote to moderator
                                    </Button>
                                    <Button variant="contained" color="error" size="small" onClick={() => removeClassS(index)}>
                                        Remove from class
                                    </Button>
                                </Typography>
                                <br />
                            </div>

                        ))}
                        <br />
                        <Divider />
                        <br />

                        <Typography variant="h5" fontWeight='bold'>
                            Add Students
                        </Typography>

                        {/*Invite Code: {classString}
            <button onClick={() => generateNewString()}>Generate New</button>
            <br></br>
            <label for="addstudent">Student Email: </label>
            <input
                name="addstudent"
                id="addstudent"
                class="input-box"
                onChange={(e) => setAddStudent(e.target.value)}
            ></input>
            <button onClick={(e) => addStudentClass(e)}>Add</button><br />
            {errMessage} */}

                        <Box display="flex" alignItems="center" mt={2}>
                            <Typography variant="body1" component="div">
                                Invite Code: {classString}
                            </Typography>
                            <Button variant="contained" color="primary" size="small" onClick={() => generateNewString()} style={{ marginLeft: '10px' }}>
                                Generate New
                            </Button>
                        </Box>

                        <Box display="flex" alignItems="center" mt={1}>
                            <InputLabel htmlFor="addstudent" mr={2}>Student Email: </InputLabel>
                            <TextField
                                name="addstudent"
                                id="addstudent"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setAddStudent(e.target.value)}
                            />
                            <Button variant="contained" color="primary" size="small" onClick={(e) => addStudentClass(e)} style={{ marginLeft: '8px' }}>
                                Add
                            </Button>
                        </Box>
                        {errMessage && (
                            <Typography variant="body2" color="error" mt={2}>
                                {errMessage}
                            </Typography>
                        )}

                        <br />
                        <Divider />
                        <br />

                        {/*<p>Files</p>
            <p>{fileList}</p>
            <input type="file" id = "file" name="file" onChange={fileChange} />
            <button onClick={(e) => addFile(e)}>Add</button>
            {isFilePicked && selectedFile ? (
                <div>
                    <p>Filename:<input value={fileName} onChange={(e) => setFileName(e.target.value)} /></p>
                    {errMessage1}
                </div>
            ) : (<div>
                <p>Select a file to add</p>
            </div>)}


            {objectURL != "" ? (
                <div>
                Preview <br></br>
                <a href={objectURL} target="_blank">Open in New Page</a>
                <object data = {objectURL} type = "application/pdf" width="100%" height="500px"></object><br></br>
                </div>
            ) : (<a></a>)}*/}



                        <Typography variant="h5" fontWeight='bold'>Files</Typography>
                        <br />
                        <Typography>{fileList}</Typography>

                        <input type="file" id="file" name="file" onChange={fileChange} />
                        <Button variant="contained" color="primary" size="small" style={{ marginLeft: '13px' }} onClick={(e) => addFile(e)}>
                            Add
                        </Button>

                        {isFilePicked && selectedFile ? (
                            <Grid item xs={12}>
                                <TextField label="Filename" value={fileName} fullWidth sx={{ maxWidth: 330, mt: 2 }} onChange={(e) => setFileName(e.target.value)} />
                                {errMessage1}
                            </Grid>

                        ) : (

                            <Typography>Select a file to add</Typography>
                        )}

                        {objectURL !== "" ? (
                            <Grid item xs={12}>
                                <Typography variant="h6">Preview</Typography>
                                <a href={objectURL} target="_blank" rel="noreferrer">Open in new page</a>
                                <object data={objectURL} type="application/pdf" width="100%" height="500px"></object>
                            </Grid>
                        ) : null}

                    </Box>

                </Grid>
            </div>
        )
    }
    else{
        return <Layout/>
    }
}
export default ClassList