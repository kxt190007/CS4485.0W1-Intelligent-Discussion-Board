<?php
$postTitles = ['Question about hw', 'When is x exam??','Another redundant Post'];
$postBodies = ['Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor??','blah blah'];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<?php foreach($postTitles as $element){ ?>
    <nav>
        <h1>
            <?= $element ?>
        </h1>
    </nav>
<?}?>

</body>
</html>