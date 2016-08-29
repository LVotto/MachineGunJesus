
private var idleAnimation : Texture2D;
private var walkAnimation : Texture2D;
private var otherAnimation : Texture2D;
private var attackAnimation : Texture2D;

var playerTransform : Transform;

private var EnemyWalk;

private var AnimationOptions = 16;
private var AnimationFrames = 4;
private var fps = 5;
private var side = 0;
private var rot : double;
private var damage : int;
private var damageFrames = 0;
private var dmgFlag = false;

function Start(){
	if(gameObject.tag == "Enemy")
		EnemyWalk = GetComponent("EnemyWalk");
	else if(gameObject.tag == "Wave")
		EnemyWalk = GetComponent("WaveWalk");

	chooseType();
}

function chooseType(){
	var chance = Random.value;

	if(chance >= 0){
		idleAnimation = Resources.Load("EnemyIdleTexture") as Texture2D;
		walkAnimation = Resources.Load("EnemyWalkTexture") as Texture2D;
		attackAnimation = Resources.Load("EnemyAttackTexture") as Texture2D;
		otherAnimation = Resources.Load("otherAnimation") as Texture2D;
	}
	else if(chance > 0){
		idleAnimation = Resources.Load("Arte/Enemies/WEnemyIdleTexture") as Texture2D;
		walkAnimation = Resources.Load("Arte/Enemies/WEnemyWalkTexture") as Texture2D;
		attackAnimation = Resources.Load("Arte/Enemies/WEnemyAttackTexture") as Texture2D;
		otherAnimation = Resources.Load("Arte/Enemies/WEnemyIdleTexture") as Texture2D;
	}//Zumbi Mulher
	else if(chance > 0){
		idleAnimation = Resources.Load("Arte/Enemies/JEnemyIdleTexture") as Texture2D;
		walkAnimation = Resources.Load("Arte/Enemies/JEnemyWalkTexture") as Texture2D;
		attackAnimation = Resources.Load("Arte/Enemies/JEnemyAttackTexture") as Texture2D;
		otherAnimation = Resources.Load("Arte/Enemies/JEnemyIdleTexture") as Texture2D;
	}//Zumbi Judeu
	else if(chance > 0){
		idleAnimation = Resources.Load("Arte/Enemies/SEnemyIdleTexture") as Texture2D;
		walkAnimation = Resources.Load("Arte/Enemies/SEnemyWalkTexture") as Texture2D;
		attackAnimation = Resources.Load("Arte/Enemies/SEnemyAttackTexture") as Texture2D;
		otherAnimation = Resources.Load("Arte/Enemies/SEnemyIdleTexture") as Texture2D;
	}//Zumbi Soldado
	else if(chance > 0){
		idleAnimation = Resources.Load("Arte/Enemies/PEnemyIdleTexture") as Texture2D;
		walkAnimation = Resources.Load("Arte/Enemies/PEnemyWalkTexture") as Texture2D;
		attackAnimation = Resources.Load("Arte/Enemies/PEnemyAttackTexture") as Texture2D;
		otherAnimation = Resources.Load("Arte/Enemies/PEnemyIdleTexture") as Texture2D;
	}//Zumbi Pastor
}


function FixedUpdate () {
	var state : int = EnemyWalk.getState();
	
	if (damageFrames > 0) {
		GetComponent.<Renderer>().material.mainTexture = idleAnimation;
		damageFrames--;
	}
	else if(state == 0) //resting
		GetComponent.<Renderer>().material.mainTexture = idleAnimation;
	else if(state == 1) //walking
		GetComponent.<Renderer>().material.mainTexture = walkAnimation;
	else if(state == 2)//attacking
		GetComponent.<Renderer>().material.mainTexture = attackAnimation;
	
	if(state < 3 || dmgFlag){ // 3 = longe demais
		side = getSide();
	
		var index : int = (Time.time * fps) % AnimationFrames;
		var AnimationSelect = side * 4 + damage;
		var size = Vector2 (1.0/AnimationFrames, 1.0/AnimationOptions);
		var offset = Vector2 (index * size.x, 1.0 - size.y - AnimationSelect * size.y);
 		
		GetComponent.<Renderer>().material.SetTextureOffset ("_MainTex", offset);
		GetComponent.<Renderer>().material.SetTextureScale ("_MainTex", size);
		
		dmgFlag = false;
	}
}

function setDamage (dmg : int) {
	damageFrames = 30;
	damage = 4*dmg/50;
	dmgFlag = true;
}

private function getSide() : int {
	var angP = transform.eulerAngles.y*Mathf.PI/180;
	var angE = EnemyWalk.getDirection();

	if(angE == 33)
		return 0;

	var ang = angE - angP;

	if(Mathf.Cos(ang) < -0.71){
		return 0; //frente
	}
	else if(Mathf.Cos(ang) > 0.71){
		return 3; //trás
	}
	else if(Mathf.Sin(ang) > 0.71){
		return 1; //direita
	}
	else if(Mathf.Sin(ang) < -0.71){
		return 2; //esquerda
	}
}
