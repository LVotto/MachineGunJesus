#pragma strict

var player : Transform;

 function Update ()
 {
     transform.rotation = Quaternion.LookRotation(transform.position - player.position);
     transform.rotation.x = 0;
     transform.rotation.z = 0;
 }