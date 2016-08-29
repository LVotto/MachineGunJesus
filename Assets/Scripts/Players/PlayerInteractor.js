#pragma strict

var BulletPrefab : GameObject;
var TurretPrefab : GameObject;
var BombPrefab : GameObject;

var Pistol_Shot : AudioClip;
var Shotgun_Shot : AudioClip;
var Rifle_Shot : AudioClip;
var Machine_Shot : AudioClip;
private var ShotSound : AudioSource;

var Pistol_Reload : AudioClip;
var Shotgun_Reload : AudioClip;
var Rifle_Reload : AudioClip;
var Machine_Reload : AudioClip;
private var ReloadSound : AudioSource;

var Knife_Hit : AudioClip;
var Sword_Hit : AudioClip;
var Cross_Hit : AudioClip;
private var HitSound : AudioSource;

var Click : AudioClip;
private var GunClick : AudioSource;

private var HP : float;
private var SFcounter : int;
private var selectedHability : int;
private var healthPacks : int;
private var ammoPacks : int;
private var shots : int;

private var blessed = false;
private var blessDelay : float = 0;

private var onlineTurret : GameObject = null;

private var fireDelay : float = 0;
private var hitDelay : float = 0;
private var reloadDelay : float = 0;
private var healDelay : float = 0;

private var faithDelay0 : float = 0;
private var faithDelay1 : float = 0;
private var faithDelay2 : float = 0;

private var scienceDelay0 : float = 0;
private var scienceDelay1 : float = 0;
private var scienceDelay2 : float = 0;

var isDead = false;
var gameTime : float;

function Start(){
	HP = 100;
	selectedHability = 0;
	healthPacks = 5;
	ammoPacks = 5;
	shots = Level.Primary_MagSize();

	ShotSound = gameObject.AddComponent(AudioSource);
	ReloadSound = gameObject.AddComponent(AudioSource);
	HitSound = gameObject.AddComponent(AudioSource);
	GunClick = gameObject.AddComponent(AudioSource);
	GunClick.clip = Click;

	if(Level.getSelectedPrimary() == 0){
		ShotSound.clip = Pistol_Shot;
		ReloadSound.clip = Pistol_Reload;
	}
	else if(Level.getSelectedPrimary() == 1){
		ShotSound.clip = Shotgun_Shot;
		ReloadSound.clip = Shotgun_Reload;
	}
	else if(Level.getSelectedPrimary() == 2){
		ShotSound.clip = Rifle_Shot;
		ReloadSound.clip = Rifle_Reload;
	}
	else if(Level.getSelectedPrimary() == 3){
		ShotSound.clip = Machine_Shot;
		ReloadSound.clip = Machine_Reload;
	}

	if(Level.getSelectedSecondary() == 0){
		HitSound.clip = Sword_Hit;
	}
	else if(Level.getSelectedSecondary() == 1){
		HitSound.clip = Knife_Hit;
	}
	else if(Level.getSelectedSecondary() == 2){
		HitSound.clip = Cross_Hit;
	}
}

function Update(){
	if (Input.GetButton("Fire")){
		Shoot();
	}
	else if (Input.GetButtonDown("Hit")){
		Hit();
	}
	else if (Input.GetButtonDown("Faith")){
		Faith();
	}
	else if(Input.GetButtonDown("Science")){
		Science();
	}
	else if(Input.GetButtonDown("Heal")){
		Heal();
	}
	else if(Input.GetButtonDown("Reload")){
		Reload();
	}
	else if (Input.GetAxis("Mouse ScrollWheel") > 0f ) // forward
 	{
    	selectedHability--;
	}
	else if (Input.GetAxis("Mouse ScrollWheel") < 0f ) // backwards
	{
    	selectedHability++;
	}

	if(selectedHability > 2)
		selectedHability -= 3;
	else if(selectedHability < 0)
		selectedHability += 3;

	if(Time.time > blessDelay){
		blessed = false;
	}

	if(onlineTurret != null){
		if (onlineTurret.GetComponent(TurretInteractor).isDead()){
			scienceDelay1 = Time.time + 5;
			Destroy(onlineTurret);
		}
	}
}

function takeDamage(amt : int){
	if(blessed)
		return;
	
	HP -= amt;

	if(HP <= 0 && !isDead){
		Die();
	}
}

private function Die(){
	GetComponent(PlayerController).enabled = false;
	isDead = true;
	gameTime = Time.time;
}

private function Hit(){
	if(Time.time < hitDelay)
		return;

	for(var enemy : GameObject in Level.Enemies){
		var distance = enemy.transform.position - transform.position;
		if(distance.magnitude < Level.Secondary_Range()){
			var product = Vector3.Dot(transform.forward, distance.normalized);
			if(product > 0.8){
				enemy.GetComponent(EnemyInteractor).takeDamage(Level.Secondary_Damage(), transform.position);
			}
		}
	}
	
	for(enemy in Level.waveEnemies){
		distance = enemy.transform.position - transform.position;
		if(distance.magnitude < Level.Secondary_Range()){
			product = Vector3.Dot(transform.forward, distance.normalized);
			if(product > 0.8){
				enemy.GetComponent(WaveInteractor).takeDamage(Level.Secondary_Damage(), transform.position);
			}
		}
	}

	HitSound.Play();

	hitDelay = Time.time + Level.Secondary_RelTime ();
}

private function Reload(){
	if(Time.time < reloadDelay || Time.time < fireDelay)
		return;

	if(ammoPacks > 0){
		ammoPacks--;
		shots = Level.Primary_MagSize();
		ReloadSound.Play();
	}

	reloadDelay = Time.time + Level.Primary_RelTime();
}

private function Heal(){
	if(Time.time < healDelay)
		return;

	if(HP < 100 && healthPacks > 0){
		healthPacks--;
		HP+=10;

		if(HP > 100)
			HP = 100;
	}

	healDelay = Time.time + 1;
}

//Versão nova que faz verificação dos inimigos
private function Shoot(){
	if(Time.time < reloadDelay || Time.time < fireDelay){
		return;
	}
	else if(shots == 0){
		fireDelay = Time.time + Level.Primary_Rate();
		GunClick.Play();
	}
	else{
		var closestEnemy : GameObject;
		var closestDistance = 80.0;
		var closestType = -1;
		
		for(var enemy : GameObject in Level.Enemies){
			var distance = (enemy.transform.position - transform.position).magnitude;
			var product = Vector3.Dot(transform.forward, (enemy.transform.position - transform.position).normalized);
			if(product > 1 - 0.3/(distance*distance) && distance < closestDistance){
				closestEnemy = enemy;
				closestDistance = distance;
				closestType = 0;
			}
		}
		
		for(enemy in Level.waveEnemies){
			distance = (enemy.transform.position - transform.position).magnitude;
			product = Vector3.Dot(transform.forward, (enemy.transform.position - transform.position).normalized);
			if(product > 1 - 0.3/(distance*distance) && distance < closestDistance){
				closestEnemy = enemy;
				closestDistance = distance;
				closestType = 1;
			}
		}
		
		if(closestType == 0)
			closestEnemy.GetComponent(EnemyInteractor).takeDamage(Level.Primary_Damage(closestDistance), transform.position);
		else if(closestType == 1)
			closestEnemy.GetComponent(WaveInteractor).takeDamage(Level.Primary_Damage(closestDistance), transform.position);
		
		ShotSound.Play();
		shots--;
		fireDelay = Time.time + Level.Primary_Rate();
	}
}

/* Versão antiga que instancia balas
private function Shoot(){
	if(Time.time < reloadDelay || Time.time < fireDelay){
		return;
	}
	else if(shots == 0){
		fireDelay = Time.time + Level.Primary_Rate();
		GunClick.Play();
	}
	else{
		var projectile : GameObject;
	    var muzzlevelocity : Vector3 = transform.forward;
	    var projMuzzleVelocity : double = 1;
	    
	    ShotSound.Play();

		muzzlevelocity = muzzlevelocity.normalized * projMuzzleVelocity;
	 
		projectile = Instantiate(BulletPrefab, transform.position, transform.rotation) as GameObject;
		projectile.GetComponent(BulletInteractor).Velocity = muzzlevelocity;
		projectile.GetComponent(BulletInteractor).Origin = transform.position;

		shots--;

		fireDelay = Time.time + Level.Primary_Rate();
		Debug.Log("Shots = " + shots);
	}
}*/

private function Faith(){
	if(selectedHability == 0)
		Bless();
	else if(selectedHability == 1)
		Convert();
	else if(selectedHability == 2)
		faithSpecial();
}

private function Science(){
	if(selectedHability == 0)
		Bomb();
	else if(selectedHability == 1)
		Turret();
	else if(selectedHability == 2)
		scienceSpecial();
}

private function Bomb(){
	if(Time.time < scienceDelay0)
		return;

	var rotation : Quaternion;
	var position = transform.position;
	var direction = transform.forward;
	var ang = transform.GetChild(0).localRotation.x;
	
	direction.y = -2*Mathf.Sin(ang);
	position = position + 2*transform.forward;
	position.y = 1;
	rotation.x = 0;
	rotation.y = 0;
	rotation.z = 0;
	rotation.z = 0;
	
	var bomb = Instantiate(BombPrefab, position, rotation) as GameObject;
	bomb.GetComponent(BombInteractor).setDirection(direction);

	scienceDelay0 = Time.time + 3;
}

private function Turret(){
	if(Time.time < scienceDelay1)
		return;
	else if(onlineTurret != null){
		onlineTurret.GetComponent(TurretInteractor).Remove();
		return;
	}

	var position = transform.position + transform.forward;
	position.y = 0.5;

	onlineTurret = Instantiate(TurretPrefab, position, transform.rotation) as GameObject;
}

private function scienceSpecial(){
	if(Time.time < scienceDelay2)
		return;

	if(Level.getSelectedCharacter() == "None")
		return;
	else if(Level.getSelectedCharacter() == "Peter")
		sciencePeter();
	else if(Level.getSelectedCharacter() == "John")
		scienceJohn();
	else if(Level.getSelectedCharacter() == "BigJames")
		scienceBigJames();
	else if(Level.getSelectedCharacter() == "SmallJames")
		scienceSmallJames();
	else if(Level.getSelectedCharacter() == "Andrew")
		scienceAndrew();
	else if(Level.getSelectedCharacter() == "Phillip")
		sciencePhillip();
	else if(Level.getSelectedCharacter() == "Bartholomew")
		scienceBartholomew();
	else if(Level.getSelectedCharacter() == "Matthew")
		scienceMatthew();
	else if(Level.getSelectedCharacter() == "Simon")
		scienceSimon();
	else if(Level.getSelectedCharacter() == "Thaddaeus")
		scienceThaddaeus();
	else if(Level.getSelectedCharacter() == "Judas")
		scienceJudas();
	else if(Level.getSelectedCharacter() == "Thomas")
		scienceThomas();
	else if(Level.getSelectedCharacter() == "Mary")
		scienceMary();
}

private function Bless(){
	if(Time.time < faithDelay0)
		return;

	blessed = true;
	faithDelay0 = Time.time + 6;
	blessDelay = Time.time + 4;
}

private function Convert(){
	if(Time.time < faithDelay1)
		return;

	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	var chosen : GameObject = null;
	var min = 100;

	for(var enemy : GameObject in enemies){
		var distance = enemy.transform.position - transform.position;
		if(distance.magnitude < min && distance.magnitude > 0){
			min = distance.magnitude;
			chosen = enemy;
		}
	}

	chosen.GetComponent(EnemyInteractor).Convert();

	faithDelay1 = Time.time + 5;
}

private function faithSpecial(){
	if(Time.time < faithDelay2)
		return;

	if(Level.getSelectedCharacter() == "None")
		return;
	else if(Level.getSelectedCharacter() == "Peter")
		faithPeter();
	else if(Level.getSelectedCharacter() == "John")
		faithJohn();
	else if(Level.getSelectedCharacter() == "BigJames")
		faithBigJames();
	else if(Level.getSelectedCharacter() == "SmallJames")
		faithSmallJames();
	else if(Level.getSelectedCharacter() == "Andrew")
		faithAndrew();
	else if(Level.getSelectedCharacter() == "Phillip")
		faithPhillip();
	else if(Level.getSelectedCharacter() == "Bartholomew")
		faithBartholomew();
	else if(Level.getSelectedCharacter() == "Matthew")
		faithMatthew();
	else if(Level.getSelectedCharacter() == "Simon")
		faithSimon();
	else if(Level.getSelectedCharacter() == "Thaddaeus")
		faithThaddaeus();
	else if(Level.getSelectedCharacter() == "Judas")
		faithJudas();
	else if(Level.getSelectedCharacter() == "Thomas")
		faithThomas();
	else if(Level.getSelectedCharacter() == "Mary")
		faithMary();
}

function OnControllerColliderHit(hit : ControllerColliderHit){
	if(hit.gameObject.tag == "Life"){
		Physics.IgnoreCollision(GetComponent(Collider), hit.collider);
		if(healthPacks < 10){
			healthPacks++;
			Destroy(hit.gameObject);
			Level.remItem();
		}
	}
	else if(hit.gameObject.tag == "Ammo"){
		Physics.IgnoreCollision(GetComponent(Collider), hit.collider);
		if(ammoPacks < 10){
			ammoPacks++;
			Destroy(hit.gameObject);
			Level.remItem();
		}
	}
}

function getHP() : int {
	return HP;
}

function getHealthPacks() : int {
	return healthPacks;
}

function getShots() : int {
	return shots;
}

function getAmmoPacks() : int {
	return ammoPacks;
}

function getSelectedHability() : int {
	return selectedHability;
}

function getBlessed() : boolean {
	return blessed;
}

//Habilidades especiais

function faithPeter() {}

function sciencePeter() {}

function faithJohn() {}

function scienceJohn() {}

function faithBigJames() {}

function scienceBigJames() {}

function faithSmallJames() {}

function scienceSmallJames() {}

function faithAndrew() {}

function scienceAndrew() {}

function faithPhillip() {}

function sciencePhillip() {}

function faithBartholomew() {}

function scienceBartholomew() {}

function faithMatthew() {}

function scienceMatthew() {}

function faithSimon() {}

function scienceSimon() {}

function faithThaddaeus() {}

function scienceThaddaeus() {}

function faithJudas() {}

function scienceJudas() {}

function faithThomas() {}

function scienceThomas() {}

function faithMary() {}

function scienceMary() {}
