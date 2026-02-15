package models

import (
	"encoding/xml"
	"time"
)

type Sitemap struct {
	XMLName xml.Name     `xml:"urlset"`
	Xmlns   string       `xml:"xmlns,attr"`
	Urls    []SitemapUrl `xml:"url"`
}

type SitemapUrl struct {
	XMLName         xml.Name   `xml:"url"`
	Location        string     `xml:"loc"`
	Modification    time.Time  `xml:"lastmod"`
	ChangeFrequency ChangeFreq `xml:"changefreq"`
	Priority        float64    `xml:"priority"`
}

type ChangeFreq string

const (
	Always  ChangeFreq = "always"
	Hourly  ChangeFreq = "hourly"
	Daily   ChangeFreq = "daily"
	Weekly  ChangeFreq = "weekly"
	Monthly ChangeFreq = "monthly"
	Yearly  ChangeFreq = "yearly"
	Never   ChangeFreq = "never"
)
