<?php

/**
* @author Daniel Marcano danielmarcanodev@gmail.com
**/

$email = isset($_POST['email']) ? $_POST['email'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';
$from = "\n\n Enviado por: " . $email;
$message .= $from;
$message = wordwrap($message, 70, "\n");

if (preg_match("/[\r\n]/", $email) || $email == '' || $message == '') {
  $response['message'] = 'There was an error trying to send your message...';
} else {
  mail("danielmarcanodev@gmail.com", "Querido Cristóbal, tienes un nuevo mensaje de tu página web", $message, $email);
  $response['message'] = 'Message sent! Thank you.';
}

echo json_encode($response);
