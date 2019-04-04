package main

import (
	"flag"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func parseConfiguration() {
	// Set defaults
	viper.SetDefault("server.host", "127.0.0.1")
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.debug", false)
	viper.SetDefault("server.domain", "127.0.0.1:8080")
	viper.SetDefault("email.host", "127.0.0.1")
	viper.SetDefault("email.port", 25)
	viper.SetDefault("email.ssl", false)
	viper.SetDefault("email.username", "ctf@example.com")
	viper.SetDefault("email.password", "ctf")
	viper.SetDefault("database.host", "127.0.0.1")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.ssl", "disable")
	viper.SetDefault("database.username", "ctf")
	viper.SetDefault("database.password", "ctf")
	viper.SetDefault("database.database", "ctf")

	// Config file location/name
	viper.SetConfigName("config")
	viper.AddConfigPath(".")

	// Get from config file
	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	// Command line flags for overriding config file
	flag.String("host", "", "Host to run on")
	flag.Int("port", 0, "Port to run on")
	flag.Bool("debug", false, "Enable debug info")

	// Get from flags
	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)
	pflag.Parse()
	if err := viper.BindPFlags(pflag.CommandLine); err != nil {
		panic(err)
	}

	// Add commandline overrides
	if viper.GetString("host") != "" {
		viper.Set("server.host", viper.GetString("host"))
	}
	if viper.GetInt("port") != 0 {
		viper.Set("server.port", viper.GetInt("port"))
	}
	if viper.GetBool("debug") != false {
		viper.Set("server.debug", viper.GetBool("debug"))
	}
}
