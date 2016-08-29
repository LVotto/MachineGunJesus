#pragma strict

static var selectedPrimary : int;
static var selectedSecondary : int;
static var selectedDificulty : int;

function Start () {
	selectedPrimary = -1;
	selectedSecondary = -1;
	selectedDificulty = -1;
}

public function Iniciar(){
	var flag = true;
	
	if(selectedPrimary == -1){
		Debug.Log("E necessario selecionar uma arma primaria.");
		flag = false;
	}
	if(selectedSecondary == -1){
		Debug.Log("E necessario selecionar uma arma secundaria.");
		flag = false;
	}
	if(selectedDificulty == -1){
		Debug.Log("E necessario selecionar uma dificuldade.");
		flag = false;
	}
	
	if(flag){
		Application.LoadLevel("Game");
	}
}

public function SelectPrimary(p : int){
	selectedPrimary = p;
}

public function SelectSecondary(p : int){
	selectedSecondary = p;
}

public function SelectDificulty(p : int){
	selectedDificulty = p;
}