<?php
include 'connect.php';

$connect = Connect();
$sql = "INSERT INTO Posts (PostID, UserID, PostStatus, PostBody, PostTitle)
VALUES(1, 1, 1, 'test', 'test')";

if ($connect->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $connect->error;
}

CloseConnect($connect);

?>