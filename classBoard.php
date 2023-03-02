<?php
$postTitles = ['Question about hw', 'When is x exam??','Another redundant Post'];
$postBodies = ['Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor??','blah blah'];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Discussion Board</title>
    <link rel="stylesheet" href="style.css" />

</head>
<body>
<h1>
    CS1234 Discussion Board   // get class name from db
</h1>
<nav>
    <center>
        <li><a href="./index.html">Home</a></li>

        <li> <a href="./login.html">Login</a></li>
        <li> <a href="./create.html">Create</a></li>
    </center>
</nav>
<homediv1>
    <a href="./class.html">Class1</a>
</homediv1>
<div>
    <a href="./classBoard.php">ClassPHPtest</a>
</div>
<div3>
    <a href="./index.html">Class3</a>

</div3>

<?php for($i = 0; $i < sizeof($postBodies); $i++){ ?>
        <h1>
            <?= $postTitles[$i] ?>
        </h1>
        <p>
            <?= $postBodies[$i] ?>
        </p>
<?php } ?>

</body>
</html>
