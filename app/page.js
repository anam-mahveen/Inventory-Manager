"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment} from "@mui/material";
//import SearchIcon from '@mui/icons-material/Search';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]); // State to store filtered items
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize with full inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const filtered = inventory.filter(({ name }) => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered); // Update the displayed items
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset to full inventory if search is cleared
    if (value === '') {
      setFilteredInventory(inventory);
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
    > 
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow="24"
          p="4"
          display="flex"
          flexDirection="column"
          gap="3"
          sx={{
            transform:"translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing="2">
            <TextField 
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button 
              variant="outlined"
              onClick={()=>{
                addItem(itemName)
                setItemName("")
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained"
        onClick={handleOpen}
      >
        Add New Item
      </Button>

      {/* Search Input */}
      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleSearch} // Handle search on Enter key press
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
            </InputAdornment>
          ),
        }}
        sx={{ width:'200px' }} // Set width of the search box
      />

      <Box border="1px solid #000">
        <Box 
          width="800px" 
          height="100px" 
          bgcolor="lightblue" 
          display="flex"
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      
        {/* Display Filtered Inventory Items */}
        <Stack width="800px" height="300px" spacing="2" overflow="auto">
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                bgcolor="#f0f0f0" 
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}