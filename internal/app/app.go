package app

// App represents the application logic
type App struct {
	Name string
}

// NewApp creates a new App instance
func NewApp(name string) *App {
	return &App{Name: name}
}

// Run starts the application
func (a *App) Run() {
	// Application logic here
}
