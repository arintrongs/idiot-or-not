package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type Submit struct {
	Uid string   `json:"uid"`
	Ans int      `json:"ans"`
	Num []int    `json:"num"`
	Op  []string `json:"op"`
}

func leaderboard(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	resp, err := http.Get("http://leaderboard/")

	fmt.Printf("/leaderboard, Request \n")

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	js, err := json.Marshal(string(body))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Printf("/leaderboard, Response : %+v\n", string(body))

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func question(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	fmt.Printf("/question, Request \n")

	resp, err := http.Get("http://gen-question/")
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	js, err := json.Marshal(string(body))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Printf("/question, Response : %+v\n", string(body))

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

}

func submit(w http.ResponseWriter, req *http.Request) {
	setupResponse(&w, req)

	decoder := json.NewDecoder(req.Body)
	var s Submit
	decoder.Decode(&s)

	js, err := json.Marshal(s)

	fmt.Printf("/submit, Request : %+v\n", string(js))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonStr := []byte(string(js))

	resp, err := http.Post("http://localhost:8080/", "application/json", bytes.NewBuffer(jsonStr))
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	js, err = json.Marshal(string(body))

	fmt.Printf("/submit, Response : %+v\n", string(body))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func test(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hii!!!!!!!\n")
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

	http.ListenAndServe(":80", nil)

}
