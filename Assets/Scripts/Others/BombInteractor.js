#pragma strict

var player : Transform;

private var speed = 10;
private var gravity = 0.01;
private var direction = Vector3.zero;
private var isdead = false;

var explosionTexture : Texture2D;

private var frames = 10;
private var duration = 2;
private var size : Vector2;

function Start(){
	size = Vector2 (1.0/frames, 1.0);
	
	GetComponent.<Renderer>().material.mainTexture = explosionTexture;
	GetComponent.<Renderer>().material.SetTextureScale ("_MainTex", size);
}

function Update () {
	if(direction.magnitude != 0){
		transform.position.x += direction.x * speed * Time.deltaTime;
		transform.position.y += direction.y * speed * Time.deltaTime;
		transform.position.z += direction.z * speed * Time.deltaTime;
		direction.y -= gravity;
	}
	if(transform.position.y <= 0){
		direction = Vector3.zero;
		Explode();
		isdead = true;
	}

	transform.rotation = Quaternion.LookRotation(transform.position - player.position);
	transform.rotation.x = 0;
	transform.rotation.z = 0;
}

function setDirection(newDir : Vector3){
	direction = newDir;
}

function Explode(){
	var Ranged : List.<GameObject> = new List.<GameObject>();
	var distances : double[] = new double[100];
	var j = 0;
	var i = 0;

	if(gameObject.name == "BombPrefab"){
		return;
	}
	
	transform.position.y = 1;
	
	for(i=0; i<frames; i++){
		var offset = Vector2 (i * size.x, 1.0 - size.y);
		GetComponent.<Renderer>().material.SetTextureOffset ("_MainTex", offset);
		yield WaitForSeconds(duration/frames);
	}
	GetComponent.<Renderer>().enabled = false;

	for(var enemy : GameObject in Level.Enemies){
		var distance = enemy.transform.position - transform.position;
	
		if(distance.magnitude < 10){
			Ranged.Add(enemy);
			distances[j++] = distance.sqrMagnitude;
		}
	}
	
	for(var enemy : GameObject in Level.waveEnemies){
		distance = enemy.transform.position - transform.position;
	
		if(distance.magnitude < 10){
			Ranged.Add(enemy);
			distances[j++] = distance.sqrMagnitude;
		}
	}
	
	j=0;
	
	for(var enemy : GameObject in Ranged){
		if(enemy.tag == "Enemy")
			enemy.GetComponent(EnemyInteractor).takeDamage(600/distances[j++], transform.position);
		else
			enemy.GetComponent(WaveInteractor).takeDamage(600/distances[j++], transform.position);
	}
	
	Destroy(gameObject);
}

function OnTriggerEnter (obj : Collider) {
	Explode();
}
