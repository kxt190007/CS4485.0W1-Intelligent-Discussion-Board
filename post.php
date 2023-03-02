<?php
include 'connect.php';

$connect = Connect();
$userID = '1'; //placeholder until user ID can be found
$postStatus = '1'; // 1 will be an unresolved post
$posttitle = $_POST['posttitle'];
$postcontent = $_POST['postcontent'];
$posttag = $_POST['tag'];
$sql = "INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag)
VALUES ('$userID','$postStatus','$postcontent','$posttitle','$posttag')";


if ($connect->query($sql) === TRUE) {
    echo "Post Created Successfully. Redirecting to home page";
} else {
    echo "Error updating record: " . $connect->error;
}

CloseConnect($connect);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="refresh" content="2; URL=index.html" />
</head>
