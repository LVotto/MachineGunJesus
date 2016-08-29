#pragma strict

var player : Transform;
private var playerdir : Quaternion;
private var swing = 0.0;
private var dir = true;

function Start () {
	Level.addItem();
}

function Update ()
{
	transform.rotation = Quaternion.LookRotation(transform.position - player.position);
	transform.rotation.x = 0;
	transform.rotation.z = 0;
	
	if(dir){
		swing += 0.3 * Time.deltaTime;
		
		if(swing >= 0.25)
			dir = false;
	}
	else{
		swing -= 0.3 * Time.deltaTime;
		
		if(swing <= -0.25)
			dir = true;	
	}
	
	transform.eulerAngles.y += swing*100;
}