#pragma strict

import System.Collections.Generic;

static var MaxEnemies = 30;
static var MaxItems = 10;
static var ItemCount : int;

private static var selectedCharacter : String = "None";
private static var Primary : int = 0;
private static var Secondary : int = 0;

static var Enemies : List.<GameObject> = new List.<GameObject>();
static var waveEnemies : List.<GameObject> = new List.<GameObject>();

static var score = 0;
private static var timecounter = 1;

private static var endTime = 240;

private var waveTime = 60;
private var isWave = false;
private static var waveEnemiesCount = 0;
private var globalBest = Vector3.zero;
private var bestValue = 10000;
var WavePrefab : GameObject;

function Start () {
	Primary = 3;//MenuOptions.selectedPrimary;
	Secondary = MenuOptions.selectedSecondary;
	
	ItemCount = 0;

	buildGround();
}

function Update(){
	if(Time.time > timecounter){
		timecounter = Time.time + 1;
	}
	if (Input.GetButton("Exit")){
		Application.Quit();
	}
	if(Time.time >= waveTime){
		moveWave();
	}
	if(Time.time >= endTime){
		Time.timeScale = 0;
	}
}

static function getSelectedCharacter() : String {
	return selectedCharacter;
}

static function getSelectedPrimary() : int {
	return Primary;
}

static function getSelectedSecondary() : int {
	return Secondary;
}

static function addWaveEnemy(){
	waveEnemiesCount ++;
}

static function remWaveEnemy(){
	waveEnemiesCount --;
	score++;
}

static function addItem(){
	ItemCount ++;
}

static function remItem(){
	ItemCount --;
}

static function isFullEnemy(){
	if(Enemies.Count >= MaxEnemies)
		return true;
	else
		return false;
}

static function isFullItem(){
	if(ItemCount >= MaxItems)
		return true;
	else
		return false;
}

//Retorna o delay
static function Primary_Rate () : double {
	if (Primary == 0) return 0.5;		//Pistola
	else if (Primary == 1) return 1;	//Shotgun
	else if (Primary == 2) return 0.1;	//Rifle
	else if (Primary == 3) return 0.2;	//Metralhadora
}

//Tempo de recarregar
static function Primary_RelTime () : double {
	if (Primary == 0) return 2;
	else if (Primary == 1) return 5;
	else if (Primary == 2) return 2;
	else if (Primary == 3) return 6;
}

//Tamanho do pente
static function Primary_MagSize () : int {
	if (Primary == 0) return 20;
	else if (Primary == 1) return 8;
	else if (Primary == 2) return 30;
	else if (Primary == 3) return 80;
}

//Dano; a distancia deve ser fornecida por que o dano depende dela
static function Primary_Damage (distance : double) : double {
	if (Primary == 0) return 10 - (distance);
	else if (Primary == 1) return 30 - (1*distance);
	else if (Primary == 2) return 30 - (2*distance);
	else if (Primary == 3) return 30 - (2*distance);
}

//Dano das armas secundarias
static function Secondary_Damage () : double {
	if (Secondary == 0) return 5;		//Cruz
	else if (Secondary == 1) return 40;	//Lança
	else if (Secondary == 2) return 40;	//Espada
	else if (Secondary == 3) return 40;	//Faca
}

//Alcance
static function Secondary_Range () : double {
	if (Secondary == 0) return 3;
	else if (Secondary == 1) return 5;
	else if (Secondary == 2) return 10;
	else if (Secondary == 3) return 10;
}

//Tempo entre os ataques
static function Secondary_RelTime () : double {
	if (Secondary == 0) return 1;
	else if (Secondary == 1) return 1;
	else if (Secondary == 2) return 1;
	else if (Secondary == 3) return 1;
}

private function buildGround(){
	var grounds = GameObject.FindGameObjectsWithTag("Ground");

	for(var ground : GameObject in grounds){
		var rnd = Random.value;

		if(rnd < 0.1){
			ground.GetComponent(Spawner).buildPasto();
		}
		else if(rnd < 0.2){
			ground.GetComponent(Spawner).buildPraca();
		}
		else if(rnd < 0.3){
			ground.GetComponent(Spawner).buildPoco();
		}
		else if(rnd < 0.35){
			ground.GetComponent(Spawner).buildMercado();
		}
		else if(rnd < 0.45){
			ground.GetComponent(Spawner).buildFlores();
		}
		else if(rnd < 0.55){
			ground.GetComponent(Spawner).buildPedra();
		}
		else if(rnd < 0.65){
			ground.GetComponent(Spawner).buildCasa();
		}
		else if(rnd < 0.70){
			ground.GetComponent(Spawner).buildCasas();
		}
		else if(rnd < 0.75){
			ground.GetComponent(Spawner).buildIgreja();
		}
		else if(rnd < 0.8){
			ground.GetComponent(Spawner).buildCemiterio();
		}
		else if(rnd < 0.95){
			ground.GetComponent(Spawner).buildPlanicie();
		}
		else{
			ground.GetComponent(Spawner).buildCruzes();
		}
	}
}

function moveWave(){
	var i : int;

	if(!isWave){
		isWave = true;

		for(i=0; i<30; i++){
			var pos = transform.position;
			pos.x += Random.value*20 - 10;
			pos.z += Random.value*20 - 10;
			pos.y = 0.5;
			waveEnemies.Add(Instantiate(WavePrefab, pos, transform.rotation) as GameObject);
		}

		return;
	}
	else if(waveEnemiesCount == 0){
		waveTime = 10000;
		return;
	}

	for(var enemy : GameObject in waveEnemies){
		if(enemy.GetComponent(WaveWalk).bestValue <= bestValue){
			globalBest = enemy.GetComponent(WaveWalk).best;
			bestValue = enemy.GetComponent(WaveWalk).bestValue;
		}
	}

	for(var enemy : GameObject in waveEnemies){
		enemy.GetComponent(WaveWalk).globalBest = globalBest;
	}

	waveTime = Time.time + 2;
}