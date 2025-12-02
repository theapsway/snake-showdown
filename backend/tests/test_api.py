import pytest
from fastapi.testclient import TestClient
from snake_showdown.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Snake Showdown API"}

def test_auth_flow():
    # Signup
    signup_data = {
        "username": "TestUser",
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/auth/signup", json=signup_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["username"] == "TestUser"
    assert data["user"]["email"] == "test@example.com"

    # Login
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["username"] == "TestUser"

    # Login with wrong password
    login_data["password"] = "wrong"
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "Invalid password."

def test_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["entries"]) > 0
    
    # Check sorting
    entries = data["entries"]
    for i in range(len(entries) - 1):
        assert entries[i]["score"] >= entries[i+1]["score"]
        assert entries[i]["rank"] == i + 1

def test_spectate():
    response = client.get("/spectate/active")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["players"]) > 0
    
    player_id = data["players"][0]["id"]
    response = client.get(f"/spectate/{player_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "gameState" in data
