const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');

let db = {
  users: [],
  categories: [],
  notes: [],
  tags: [],
  noteTags: [],
  reviews: []
};

const loadDB = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
    }
  } catch (error) {
    console.log('Creating new database...');
  }
};

const saveDB = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

loadDB();

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

module.exports = {
  db,
  loadDB,
  saveDB,
  generateId,

  User: {
    create: (data) => {
      const user = { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.users.push(user);
      saveDB();
      return user;
    },
    findById: (id) => db.users.find(u => u.id === id),
    findByUsername: (username) => db.users.find(u => u.username === username),
    findAll: () => db.users,
    update: (id, data) => {
      const index = db.users.findIndex(u => u.id === id);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...data, updatedAt: new Date().toISOString() };
        saveDB();
        return db.users[index];
      }
      return null;
    },
    delete: (id) => {
      const index = db.users.findIndex(u => u.id === id);
      if (index !== -1) {
        db.users.splice(index, 1);
        saveDB();
        return true;
      }
      return false;
    }
  },

  Category: {
    create: (data) => {
      const category = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.categories.push(category);
      saveDB();
      return category;
    },
    findById: (id) => db.categories.find(c => c.id === id),
    findAll: () => db.categories,
    findByUserId: (userId) => db.categories.filter(c => c.userId === userId),
    update: (id, data) => {
      const index = db.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        db.categories[index] = { ...db.categories[index], ...data, updatedAt: new Date().toISOString() };
        saveDB();
        return db.categories[index];
      }
      return null;
    },
    delete: (id) => {
      const index = db.categories.findIndex(c => c.id === id);
      if (index !== -1) {
        db.categories.splice(index, 1);
        saveDB();
        return true;
      }
      return false;
    }
  },

  Note: {
    create: (data) => {
      const note = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false, ...data };
      db.notes.push(note);
      saveDB();
      return note;
    },
    findById: (id) => db.notes.find(n => n.id === id),
    findAll: () => db.notes.filter(n => !n.isDeleted),
    findByUserId: (userId) => db.notes.filter(n => n.userId === userId),
    findDeleted: () => db.notes.filter(n => n.isDeleted),
    update: (id, data) => {
      const index = db.notes.findIndex(n => n.id === id);
      if (index !== -1) {
        db.notes[index] = { ...db.notes[index], ...data, updatedAt: new Date().toISOString() };
        saveDB();
        return db.notes[index];
      }
      return null;
    },
    softDelete: (id) => {
      const note = db.notes.find(n => n.id === id);
      if (note) {
        note.isDeleted = true;
        note.deletedAt = new Date().toISOString();
        saveDB();
        return note;
      }
      return null;
    },
    recover: (id) => {
      const note = db.notes.find(n => n.id === id);
      if (note) {
        note.isDeleted = false;
        delete note.deletedAt;
        saveDB();
        return note;
      }
      return null;
    },
    permanentDelete: (id) => {
      const index = db.notes.findIndex(n => n.id === id);
      if (index !== -1) {
        db.notes.splice(index, 1);
        saveDB();
        return true;
      }
      return false;
    }
  },

  Tag: {
    create: (data) => {
      const tag = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.tags.push(tag);
      saveDB();
      return tag;
    },
    findById: (id) => db.tags.find(t => t.id === id),
    findAll: () => db.tags,
    findByUserId: (userId) => db.tags.filter(t => t.userId === userId),
    findOrCreate: (name, userId) => {
      let tag = db.tags.find(t => t.name === name && t.userId === userId);
      if (!tag) {
        tag = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), name, userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        db.tags.push(tag);
        saveDB();
      }
      return tag;
    },
    update: (id, data) => {
      const index = db.tags.findIndex(t => t.id === id);
      if (index !== -1) {
        db.tags[index] = { ...db.tags[index], ...data, updatedAt: new Date().toISOString() };
        saveDB();
        return db.tags[index];
      }
      return null;
    },
    delete: (id) => {
      const index = db.tags.findIndex(t => t.id === id);
      if (index !== -1) {
        db.tags.splice(index, 1);
        saveDB();
        return true;
      }
      return false;
    }
  },

  Review: {
    create: (data) => {
      const review = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.reviews.push(review);
      saveDB();
      return review;
    },
    findById: (id) => db.reviews.find(r => r.id === id),
    findAll: () => db.reviews,
    findByNoteId: (noteId) => db.reviews.filter(r => r.noteId === noteId),
    findDueReviews: (userId) => {
      const now = new Date().toISOString();
      return db.reviews.filter(r => r.userId === userId && r.nextReviewAt && r.nextReviewAt <= now);
    },
    update: (id, data) => {
      const index = db.reviews.findIndex(r => r.id === id);
      if (index !== -1) {
        db.reviews[index] = { ...db.reviews[index], ...data, updatedAt: new Date().toISOString() };
        saveDB();
        return db.reviews[index];
      }
      return null;
    },
    delete: (id) => {
      const index = db.reviews.findIndex(r => r.id === id);
      if (index !== -1) {
        db.reviews.splice(index, 1);
        saveDB();
        return true;
      }
      return false;
    }
  }
};
