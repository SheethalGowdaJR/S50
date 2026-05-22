import json
import glob
import os
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from urllib.parse import urlparse
import time
import sys

def verify_url(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers, stream=True, timeout=10, verify=False)
        if response.status_code == 200:
            content_type = response.headers.get("Content-Type", "")
            if "image" in content_type or "svg" in content_type:
                return True
            if "text/html" in content_type:
                return False
            return True
        return False
    except Exception as e:
        return False

def get_domain(url):
    try:
        if not url:
            return None
        if not url.startswith("http"):
            url = "https://" + url
        parsed = urlparse(url)
        domain = parsed.netloc
        if domain.startswith("www."):
            domain = domain[4:]
        return domain
    except:
        return None

def main():
    report = []
    
    files = glob.glob("*_golden_record.json")
    for f in files:
        with open(f, 'r', encoding='utf-8') as infile:
            try:
                data = json.load(infile)
            except json.JSONDecodeError:
                continue
                
        company_name = data.get("Company Name", "Unknown")
        logo_str = data.get("Logo", "")
        website = data.get("Website URL", "")
        
        if not logo_str:
            continue
            
        primary_url = logo_str.split(";")[0].strip()
        
        print(f"Checking {company_name}: {primary_url}...", end=" ")
        sys.stdout.flush()
        
        if verify_url(primary_url):
            print("OK")
            continue
            
        print("FAILED")
        
        domain = get_domain(website)
        if not domain:
            report.append({
                "Company": company_name,
                "Old": logo_str,
                "New": "N/A",
                "Status": "Failed (No domain)"
            })
            continue
            
        new_logo = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
        
        print(f"  Trying Google Favicon: {new_logo}...", end=" ")
        sys.stdout.flush()
        
        if verify_url(new_logo):
            print("WORKING")
            data["Logo"] = new_logo
            with open(f, 'w', encoding='utf-8') as outfile:
                json.dump(data, outfile, indent=4)
            report.append({
                "Company": company_name,
                "Old": logo_str,
                "New": new_logo,
                "Status": "Working"
            })
        else:
            print("FAILED")
            report.append({
                "Company": company_name,
                "Old": logo_str,
                "New": new_logo,
                "Status": "Failed (Google Favicon also broken)"
            })
            
    print("\n--- SUMMARY REPORT ---")
    print("-" * 150)
    for row in report:
        old_short = row["Old"][:57] + "..." if len(row["Old"]) > 60 else row["Old"]
        print(f"Company Name       : {row['Company']}")
        print(f"Old Logo URL       : {old_short}")
        print(f"New Logo URL       : {row['New']}")
        print(f"Verification Status: {row['Status']}")
        print("-" * 50)

if __name__ == "__main__":
    main()
