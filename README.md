# dbdump

Export a normalized MySQL backup.

## Installation

```bash
npm install -g @luissquall/dbdump
```

## Usage

```bash
# Print dump to stdout
dbdump -u user -p1234 -d database

# Redirect output to a file
dbdump -u user -p -d database > struct.sql

# User without password
dbdump -u user -d database > struct.sql
```
