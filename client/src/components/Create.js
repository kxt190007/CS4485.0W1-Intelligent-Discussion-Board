import React from 'react'

function Create() {
  return (
    <div><h1>Create Post</h1>
      <form>
        <input
          name="posttitle"
          type="text"
          id="posttitle"
          class="input-box"
          placeholder="Post Title"
          required="required"
        ></input><br />
        <textarea
          name="postcontent"
          id="postcontent"
          class="input-box"
          placeholder="Post content"
          required="required"
        ></textarea> <br />
        <label for="tag">Tag (Optional):</label>
        <input list="tagpresets" id="tag" name="tag"></input>

        <datalist id="tagpresets">
          <option value="Homework"></option>
          <option value="Exam"></option>
          <option value="Project"></option>
          <option value="General"></option>
        </datalist> <br />
        <input type="submit" value="Create Post"></input>
      </form>
    </div>
  )
}

export default Create