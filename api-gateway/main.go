package main

import (
		"log"
		"encoding/json"
		"net/http"
)

type Submit struct {
	Uid  string `json:"uid"`
	Ans  int		`json:"ans"`
}

func leaderboard(w http.ResponseWriter, req *http.Request) {
		resp, err := http.Get("http://leaderboard/")

		js, err := json.Marshal(resp)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
    w.Write(js)
}

func question(w http.ResponseWriter, req *http.Request) {
	resp, err := http.Get("http://question/")

	js, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
    
}

func submit(w http.ResponseWriter, req *http.Request) {
		decoder := json.NewDecoder(req.Body)
		var s Submit
		decoder.Decode(&s)
		// resp, err := http.Post("http://check", "application/json", )

		json, err := json.Marshal(s)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")	
		w.Write(json)
}

func failOnError(err error, msg string) {
  if err != nil {
    log.Fatalf("%s: %s", msg, err)
  }
}
func main() {

		http.HandleFunc("/leaderboard", leaderboard)
		http.HandleFunc("/question", question)
    http.HandleFunc("/submit", submit)

		http.ListenAndServe(":8090", nil)
		
}