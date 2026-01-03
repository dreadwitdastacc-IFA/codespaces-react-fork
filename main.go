package main

import (
	"fmt"
	"github.com/dreadwitdastacc-IFA/validatord/internal/app"
)

func main() {
	a := app.NewApp("MyApp")
	fmt.Printf("Starting %s\n", a.Name)
	a.Run()
	fmt.Println("App finished")
}
