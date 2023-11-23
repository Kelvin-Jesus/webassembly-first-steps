package main

func main() {}

// the following comment tells the tinygo compiler to expose this function to JS
//export add
func add(x, y int) int {
	return x + y;
}