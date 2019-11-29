package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type Submit struct {
	Uid string `json:"uid"`
	Ans int    `json:"ans"`
}

func leaderboard(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	resp, err := http.Get("http://leaderboard/")

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	js, err := json.Marshal(string(body))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func question(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	resp, err := http.Get("http://gen-question/")
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	js, err := json.Marshal(string(body))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

}

func submit(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	decoder := json.NewDecoder(req.Body)
	var s Submit
	decoder.Decode(&s)

	json, err := json.Marshal(s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Post("http://check-ans/", "application/json", req.Body)

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

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
func main() {

	http.HandleFunc("/leaderboard", leaderboard)
	http.HandleFunc("/question", question)
	http.HandleFunc("/submit", submit)
	http.HandleFunc("/test", test)

	http.ListenAndServe(":8090", nil)

}
