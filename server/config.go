package main

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

type FromConfig struct {
	Email		Email		`yaml:"email"`
	Database	Database	`yaml:"database"`
	Server		Server		`yaml:"server"`
}

type Email struct {
	Username	string		`yaml:"username"`
	Password	string		`yaml:"password"`
	Host		string		`yaml:"host"`
	Port		int			`yaml:"port"`
	SSL			bool		`yaml:"ssl"`
}

type Database struct {
	Username	string		`yaml:"username"`
	Password	string		`yaml:"password"`
	Host		string		`yaml:"host"`
	Port		int			`yaml:"port"`
	Database	string		`yaml:"database"`
	SSL			string		`yaml:"ssl"`
}

type Server struct {
	Host		string		`yaml:"host"`
	Port		int			`yaml:"port"`
	Debug		bool		`yaml:"debug"`
	Domain		string		`yaml:"domain"`
}

func getConfig() FromConfig {
	data, err := ioutil.ReadFile("config.yaml")
	if err != nil {
		panic(err)
	}

	fc := FromConfig{}
	if err := yaml.Unmarshal(data, &fc); err != nil {
		panic(err)
	}

	return fc
}
