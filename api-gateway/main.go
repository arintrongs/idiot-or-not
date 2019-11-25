package main

import (
		"fmt"
		"log"
		"os"
		"encoding/json"
		"net/http"
)

type Submit struct {
	Uid  string `json:"uid"`
	Ans  int		`json:"ans"`
}

func leaderboard(w http.ResponseWriter, req *http.Request) {
		resp, err := http.Get(os.Getenv("LEADERBOARD_URL"))

		js, err := json.Marshal(resp)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
    w.Write(js)
}

func question(w http.ResponseWriter, req *http.Request) {
	resp, err := http.Get(os.Getenv("QUESTION_URL"))

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
		

		json, err := json.Marshal(s)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		http.Post(os.Getenv("SUBMIT_URL"), "application/json", req.Body)

		w.Header().Set("Content-Type", "application/json")	
		w.Write(json)
}

func test(w http.ResponseWriter, req *http.Request) {
		fmt.Fprintf(w, "Hii!!!!!!!")
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
		http.HandleFunc("/test", test)

		http.ListenAndServe(":8090", nil)
		
}